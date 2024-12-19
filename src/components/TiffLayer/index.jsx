import React, { useState, useEffect, useContext } from 'react';
import { MapContext } from '@/contexts/MapContext';
import useMapStore from '@/stores/mapStore';
import { Source, Layer } from 'react-map-gl/maplibre';
import GeoTIFF from 'geotiff';
import { AccessTokenContext } from '@/contexts/AccessTokenProvider';

const evalscript = `//VERSION=3
function setup() {
  return{
    input: [{
      bands: ["B04", "B08"],
      units: "REFLECTANCE"
    }],
    output: {
      id: "default",
      bands: 1,
      sampleType: SampleType.INT16 
    }
  }
}

function evaluatePixel(sample) {
  let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04)
  // Return NDVI multiplied by 10000 as integers to save processing units. To obtain NDVI values, simply divide the resulting pixel values by 10000.
  return [ndvi * 10000]
}`;

const renderGeoTIFFImage = async (image) => {
  const width = image.getWidth();
  const height = image.getHeight();
  const rasters = await image.readRasters();
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Render NDVI values to a grayscale image
  const numPixels = width * height;
  for (let i = 0; i < numPixels; i++) {
    const ndviValue = rasters[0][i] / 10000; // Scale back NDVI from integer
    const color = Math.floor((ndviValue + 1) * 128); // Convert NDVI (-1 to 1) to grayscale (0-255)
    data[i * 4] = color; // Red
    data[i * 4 + 1] = color; // Green
    data[i * 4 + 2] = color; // Blue
    data[i * 4 + 3] = 255; // Alpha
  }

  ctx.putImageData(imageData, 0, 0);

  // Get the image coordinates for the map
  const bbox = image.getBoundingBox(); // [minX, minY, maxX, maxY]
  const coordinates = [
    [bbox[0], bbox[3]], // Top-left
    [bbox[2], bbox[3]], // Top-right
    [bbox[2], bbox[1]], // Bottom-right
    [bbox[0], bbox[1]], // Bottom-left
  ];

  return { imageData, canvas, coordinates };
};

export default function TiffLayer() {
  const { mapInstance } = useContext(MapContext);
  const accessToken = useContext(AccessTokenContext);
  const [imageUrl, setImageUrl] = useState(null);
  const [geotiffImage, setGeotiffImage] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  // Fetch GeoTIFF Data from Sentinel Hub API
  useEffect(() => {
    if (mapInstance && accessToken) {
      const fetchGeoTIFF = async () => {
        // Get the current viewport's bounding box
        const bounds = mapInstance.getBounds();
        const bbox = [
          bounds.getWest(),
          bounds.getSouth(),
          bounds.getEast(),
          bounds.getNorth(),
        ];

        console.log('bbox is', bbox);

        const zoom = mapInstance.getZoom();
        const resolution = 156543.03 / Math.pow(2, zoom); // Resolution in meters per pixel at the equator
        const width = Math.ceil((bbox[2] - bbox[0]) / resolution);
        const height = Math.ceil((bbox[3] - bbox[1]) / resolution);

        console.log('width, height', width, height);
        const requestBody = {
          input: {
            bounds: {
              properties: {
                crs: 'http://www.opengis.net/def/crs/OGC/1.3/CRS84',
              },
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [bbox[0], bbox[3]],
                    [bbox[2], bbox[3]],
                    [bbox[2], bbox[1]],
                    [bbox[0], bbox[1]],
                    [bbox[0], bbox[3]],
                  ],
                ],
              },
            },
            data: [
              {
                type: 'sentinel-2-l2a',
                dataFilter: {
                  timeRange: {
                    from: '2024-06-01T00:00:00Z',
                    to: '2024-10-31T00:00:00Z',
                  },
                },
                processing: {
                  harmonizeValues: true,
                },
              },
            ],
          },
          output: {
            width: width,
            height: height,
            responses: [
              {
                identifier: 'default',
                format: {
                  type: 'image/tiff',
                },
              },
            ],
          },
          evalscript: evalscript,
        };

        try {
          const response = await fetch(
            'https://services.sentinel-hub.com/api/v1/process',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
            }
          );
          const arrayBuffer = await response.arrayBuffer();

          // Parse the GeoTIFF data
          const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
          const image = await tiff.getImage();
          setGeotiffImage(image);

          // Render the image to a canvas and get the data URL
          const { imageData, canvas, coordinates } = await renderGeoTIFFImage(
            image
          );
          const dataUrl = canvas.toDataURL();
          console.log('tiff imageURL is', dataUrl);
          setImageUrl(dataUrl);
          setCoordinates(coordinates); // Coordinates for the ImageSource
        } catch (error) {
          console.error('Error fetching GeoTIFF:', error);
        }
      };

      fetchGeoTIFF();
    }
  }, [mapInstance, accessToken]);

  // Extract NDVI Values on mouse hover
  useEffect(() => {
    if (mapInstance && geotiffImage) {
      const handleMouseMove = async (event) => {
        const lngLat = event.lngLat;
        const pixelValue = await getPixelValueAtLngLat(
          geotiffImage,
          lngLat.lng,
          lngLat.lat
        );
        console.log('NDVI Value:', pixelValue);
      };

      mapInstance.on('mousemove', handleMouseMove);
      console.log('adding handleMouseMove');

      return () => {
        console.log('removing handleMouseMove');
        mapInstance.off('mousemove', handleMouseMove);
      };
    }
  }, [mapInstance, geotiffImage]);

  const getPixelValueAtLngLat = async (image, lng, lat) => {
    const bbox = image.getBoundingBox(); // [minX, minY, maxX, maxY]
    const width = image.getWidth();
    const height = image.getHeight();

    // Convert lng/lat to image coordinates
    const x = ((lng - bbox[0]) / (bbox[2] - bbox[0])) * width;
    const y = ((bbox[3] - lat) / (bbox[3] - bbox[1])) * height;

    if (x < 0 || x >= width || y < 0 || y >= height) {
      return null; // Outside of image bounds
    }

    // Read raster values at the pixel location
    const rasters = await image.readRasters({
      window: [
        Math.floor(x),
        Math.floor(y),
        Math.ceil(x) + 1,
        Math.ceil(y) + 1,
      ],
      width: 1,
      height: 1,
    });

    console.log('NDVI value ', rasters[0][0] / 1000);
    // Return the NDVI value
    return rasters[0][0] / 10000; // Scale back the NDVI value
  };

  console.log('tiff imageURL is', imageUrl);

  return (
    <>
      {imageUrl && (
        <Source type="image" url={imageUrl} coordinates={coordinates}>
          <Layer id="tiff-layer" type="raster" />
        </Source>
      )}
    </>
  );
}
