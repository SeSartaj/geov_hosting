import { API_URL } from '@/constants';
import { fetchWrapper } from '../utils/fetchWrapper';

const DUMMY_RESPONSE = [
  {
    id: 18960,
    paw_graphs: [
      {
        id: '1a9eee5f-d0ec-4e67-8d48-e3e46b44009c',
        label: '1 foot WC',
        chart: {
          id: 'd3522b8d-0358-4c1e-81b9-51707f2f5eb1',
          name: 'PLOT 2 POTATO PLANT AVAILABLE WATER',
          user: {
            username: 'demo',
          },
        },
        last_value: [1710950400000.0, 19.7],
      },
      {
        id: '737b4673-f2b2-41fd-91f5-9d6403bae3dc',
        label: '2 foot WC',
        chart: {
          id: 'd3522b8d-0358-4c1e-81b9-51707f2f5eb1',
          name: 'PLOT 2 POTATO PLANT AVAILABLE WATER',
          user: {
            username: 'demo',
          },
        },
        last_value: [1710950400000.0, 4.9],
      },
    ],
    graphs: [],
    device: {
      name: 'PLOT 2',
      api: 'Zentra',
      serial: 'z6-07416',
      last_transmission: '2024-03-22T13:00:00-03:00',
      users: [
        {
          username: 'pieterpaulmichau@gmail.com',
        },
        {
          username: 'Benn',
        },
        {
          username: 'Kikko',
        },
        {
          username: 'demometerusa',
        },
        {
          username: 'fperez@agricolasutil.cl',
        },
        {
          username: 'Juan',
        },
        {
          username: 'ashish',
        },
        {
          username: 'SLG',
        },
        {
          username: 'Pagranifo',
        },
        {
          username: 'Gom nam',
        },
        {
          username: 'Sanosvaldo ',
        },
        {
          username: 'Ana',
        },
        {
          username: 'Bae 💝💖',
        },
        {
          username: 'Oktafz',
        },
        {
          username: 'juan1789',
        },
        {
          username: 'AVENTURA',
        },
        {
          username: 'farmer Joe',
        },
        {
          username: 'Gerhard Peters Blatz',
        },
        {
          username: 'Tarahamal ',
        },
        {
          username: 'Takoua',
        },
        {
          username: 'Wahid rafaat',
        },
        {
          username: 'test_user_02',
        },
        {
          username: 'Endless ',
        },
        {
          username: 'Wahidrafaat',
        },
        {
          username: 'Nashimwe',
        },
        {
          username: 'Rabbit Run',
        },
        {
          username: 'Gilbert ',
        },
        {
          username: 'Andawari doutimi ',
        },
        {
          username: 'test_user_12',
        },
        {
          username: 'I love farms 23',
        },
        {
          username: 'Itz obyno ',
        },
        {
          username: 'demo',
        },
        {
          username: 'adel',
        },
        {
          username: 'DIINA NDINELAO ',
        },
        {
          username: 'Nelson',
        },
        {
          username: 'elparque',
        },
        {
          username: 'jsilv0784@gmail.com',
        },
        {
          username: 'testuser',
        },
        {
          username: 'jmw132001',
        },
        {
          username: 'Asha',
        },
        {
          username: 'Rodrigo Barraza ',
        },
        {
          username: 'Hyginus@',
        },
        {
          username: 'isyo',
        },
        {
          username: 'Clobis Ponce',
        },
      ],
      is_lagging: true,
      is_battery_low: false,
      details: {
        battery: 74,
        location: {
          alt: 142.512,
          lat: -40.9503019,
          lng: -73.153113,
        },
        timezone: 'America/Santiago',
        use_push_api: false,
        use_zentra_v3: true,
        download_in_progress: false,
        sensors_without_data: 100,
        no_sensors_without_data: 7,
      },
      plot: null,
      crop: 'POTATO',
    },
    farm: {
      id: 345,
      name: 'Farm 1',
    },
    location_name: '',
    lng: null,
    lat: null,
    use_custom_location: false,
    avg_paw: 32,
    marker_map: 4934,
  },
  {
    id: 18961,
    paw_graphs: [],
    graphs: [],
    device: {
      name: 'la union',
      api: 'Fieldclimate',
      serial: '002049C6',
      last_transmission: '2024-07-28T14:00:01-04:00',
      users: [
        {
          username: 'pieterpaulmichau@gmail.com',
        },
        {
          username: 'Benn',
        },
        {
          username: 'Kikko',
        },
        {
          username: 'demometerusa',
        },
        {
          username: 'fperez@agricolasutil.cl',
        },
        {
          username: 'Juan',
        },
        {
          username: 'ashish',
        },
        {
          username: 'nuevaagricola',
        },
        {
          username: 'SLG',
        },
        {
          username: 'Pagranifo',
        },
        {
          username: 'Gom nam',
        },
        {
          username: 'Sanosvaldo ',
        },
        {
          username: 'Ana',
        },
        {
          username: 'Bae 💝💖',
        },
        {
          username: 'Oktafz',
        },
        {
          username: 'juan1789',
        },
        {
          username: 'AVENTURA',
        },
        {
          username: 'farmer Joe',
        },
        {
          username: 'Gerhard Peters Blatz',
        },
        {
          username: 'Tarahamal ',
        },
        {
          username: 'Takoua',
        },
        {
          username: 'Wahid rafaat',
        },
        {
          username: 'test_user_02',
        },
        {
          username: 'Endless ',
        },
        {
          username: 'Wahidrafaat',
        },
        {
          username: 'Nashimwe',
        },
        {
          username: 'Rabbit Run',
        },
        {
          username: 'Gilbert ',
        },
        {
          username: 'Andawari doutimi ',
        },
        {
          username: 'test_user_12',
        },
        {
          username: 'I love farms 23',
        },
        {
          username: 'Itz obyno ',
        },
        {
          username: 'demo',
        },
        {
          username: 'adel',
        },
        {
          username: 'DIINA NDINELAO ',
        },
        {
          username: 'Nelson',
        },
        {
          username: 'jsilv0784@gmail.com',
        },
        {
          username: 'testuser',
        },
        {
          username: 'jmw132001',
        },
        {
          username: 'Asha',
        },
        {
          username: 'Rodrigo Barraza ',
        },
        {
          username: 'Hyginus@',
        },
        {
          username: 'isyo',
        },
        {
          username: 'Clobis Ponce',
        },
      ],
      is_lagging: false,
      is_battery_low: true,
      details: {
        battery: 2.1,
        location: {
          alt: 56.8,
          lat: -40.33918,
          lng: -73.044944,
          timezone: 'America/Santiago',
        },
        timezone: 'America/Santiago',
        download_in_progress: false,
        sensors_without_data: 7,
        no_sensors_without_data: 1,
      },
      plot: '',
      crop: '',
    },
    farm: null,
    location_name: '',
    lng: null,
    lat: null,
    use_custom_location: false,
    avg_paw: null,
    marker_map: 4934,
  },
  {
    id: 18959,
    paw_graphs: [
      {
        id: '5d889f5e-ba28-432f-857b-206f7558e28f',
        label: '1 foot WC',
        chart: {
          id: '43803e73-2f15-4b34-a707-61b0a57bbb94',
          name: 'PLOT 1 POTATO PLANT AVAILABLE WATER',
          user: {
            username: 'demo',
          },
        },
        last_value: [1709564400000.0, 75.3],
      },
      {
        id: '41580187-1a28-4dda-9b31-d23928a7b19b',
        label: '2 foot WC',
        chart: {
          id: '43803e73-2f15-4b34-a707-61b0a57bbb94',
          name: 'PLOT 1 POTATO PLANT AVAILABLE WATER',
          user: {
            username: 'demo',
          },
        },
        last_value: [1709564400000.0, 74.0],
      },
    ],
    graphs: [],
    device: {
      name: 'PLOT 1',
      api: 'Zentra',
      serial: 'z6-07441',
      last_transmission: '2024-03-05T15:00:00-03:00',
      users: [
        {
          username: 'pieterpaulmichau@gmail.com',
        },
        {
          username: 'Benn',
        },
        {
          username: 'Kikko',
        },
        {
          username: 'demometerusa',
        },
        {
          username: 'fperez@agricolasutil.cl',
        },
        {
          username: 'Juan',
        },
        {
          username: 'ashish',
        },
        {
          username: 'SLG',
        },
        {
          username: 'Pagranifo',
        },
        {
          username: 'Gom nam',
        },
        {
          username: 'Sanosvaldo ',
        },
        {
          username: 'Ana',
        },
        {
          username: 'Bae 💝💖',
        },
        {
          username: 'Oktafz',
        },
        {
          username: 'juan1789',
        },
        {
          username: 'AVENTURA',
        },
        {
          username: 'farmer Joe',
        },
        {
          username: 'Gerhard Peters Blatz',
        },
        {
          username: 'Tarahamal ',
        },
        {
          username: 'Takoua',
        },
        {
          username: 'Wahid rafaat',
        },
        {
          username: 'test_user_02',
        },
        {
          username: 'Endless ',
        },
        {
          username: 'Wahidrafaat',
        },
        {
          username: 'Nashimwe',
        },
        {
          username: 'Rabbit Run',
        },
        {
          username: 'Gilbert ',
        },
        {
          username: 'Andawari doutimi ',
        },
        {
          username: 'test_user_12',
        },
        {
          username: 'I love farms 23',
        },
        {
          username: 'Itz obyno ',
        },
        {
          username: 'demo',
        },
        {
          username: 'adel',
        },
        {
          username: 'DIINA NDINELAO ',
        },
        {
          username: 'Nelson',
        },
        {
          username: 'elparque',
        },
        {
          username: 'jsilv0784@gmail.com',
        },
        {
          username: 'testuser',
        },
        {
          username: 'jmw132001',
        },
        {
          username: 'Asha',
        },
        {
          username: 'Rodrigo Barraza ',
        },
        {
          username: 'Hyginus@',
        },
        {
          username: 'isyo',
        },
        {
          username: 'Clobis Ponce',
        },
      ],
      is_lagging: true,
      is_battery_low: false,
      details: {
        battery: 89,
        location: {
          alt: 145.223,
          lat: -41.0850084,
          lng: -71.3105914,
        },
        timezone: 'America/Santiago',
        use_push_api: false,
        download_in_progress: false,
        sensors_without_data: 100,
        no_sensors_without_data: 7,
      },
      plot: null,
      crop: 'POTATO',
    },
    farm: {
      id: 345,
      name: 'Farm 1',
    },
    location_name: '',
    lng: null,
    lat: null,
    use_custom_location: false,
    avg_paw: 12,
    marker_map: 4934,
  },
  {
    id: 1899,
    paw_graphs: [
      {
        id: '5d889f5e-ba28-432f-857b-206f7558e28f',
        label: '1 foot WC',
        chart: {
          id: '43803e73-2f15-4b34-a707-61b0a57bbb94',
          name: 'PLOT 1 POTATO PLANT AVAILABLE WATER',
          user: {
            username: 'demo',
          },
        },
        last_value: [1709564400000.0, 75.3],
      },
      {
        id: '41580187-1a28-4dda-9b31-d23928a7b19b',
        label: '2 foot WC',
        chart: {
          id: '43803e73-2f15-4b34-a707-61b0a57bbb94',
          name: 'PLOT 1 POTATO PLANT AVAILABLE WATER',
          user: {
            username: 'demo',
          },
        },
        last_value: [1709564400000.0, 74.0],
      },
    ],
    graphs: [],
    device: {
      name: 'PLOT 1',
      api: 'Zentra',
      serial: 'z6-07441',
      last_transmission: '2024-03-05T15:00:00-03:00',
      users: [
        {
          username: 'pieterpaulmichau@gmail.com',
        },
        {
          username: 'Benn',
        },
        {
          username: 'Kikko',
        },
        {
          username: 'demometerusa',
        },
        {
          username: 'fperez@agricolasutil.cl',
        },
        {
          username: 'Juan',
        },
        {
          username: 'ashish',
        },
        {
          username: 'SLG',
        },
        {
          username: 'Pagranifo',
        },
        {
          username: 'Gom nam',
        },
        {
          username: 'Sanosvaldo ',
        },
        {
          username: 'Ana',
        },
        {
          username: 'Bae 💝💖',
        },
        {
          username: 'Oktafz',
        },
        {
          username: 'juan1789',
        },
        {
          username: 'AVENTURA',
        },
        {
          username: 'farmer Joe',
        },
        {
          username: 'Gerhard Peters Blatz',
        },
        {
          username: 'Tarahamal ',
        },
        {
          username: 'Takoua',
        },
        {
          username: 'Wahid rafaat',
        },
        {
          username: 'test_user_02',
        },
        {
          username: 'Endless ',
        },
        {
          username: 'Wahidrafaat',
        },
        {
          username: 'Nashimwe',
        },
        {
          username: 'Rabbit Run',
        },
        {
          username: 'Gilbert ',
        },
        {
          username: 'Andawari doutimi ',
        },
        {
          username: 'test_user_12',
        },
        {
          username: 'I love farms 23',
        },
        {
          username: 'Itz obyno ',
        },
        {
          username: 'demo',
        },
        {
          username: 'adel',
        },
        {
          username: 'DIINA NDINELAO ',
        },
        {
          username: 'Nelson',
        },
        {
          username: 'elparque',
        },
        {
          username: 'jsilv0784@gmail.com',
        },
        {
          username: 'testuser',
        },
        {
          username: 'jmw132001',
        },
        {
          username: 'Asha',
        },
        {
          username: 'Rodrigo Barraza ',
        },
        {
          username: 'Hyginus@',
        },
        {
          username: 'isyo',
        },
        {
          username: 'Clobis Ponce',
        },
      ],
      is_lagging: true,
      is_battery_low: false,
      details: {
        battery: 89,
        location: {
          alt: 145.223,
          lat: -41.086,
          lng: -73.3605914,
        },
        timezone: 'America/Santiago',
        use_push_api: false,
        download_in_progress: false,
        sensors_without_data: 100,
        no_sensors_without_data: 7,
      },
      plot: null,
      crop: 'POTATO',
    },
    farm: {
      id: 345,
      name: 'Farm 1',
    },
    location_name: '',
    lng: null,
    lat: null,
    use_custom_location: false,
    avg_paw: 120,
    marker_map: 4934,
  },
  {
    id: 1895,
    paw_graphs: [
      {
        id: '5d889f5e-ba28-432f-857b-206f7558e28f',
        label: '1 foot WC',
        chart: {
          id: '43803e73-2f15-4b34-a707-61b0a57bbb94',
          name: 'PLOT 1 POTATO PLANT AVAILABLE WATER',
          user: {
            username: 'demo',
          },
        },
        last_value: [1709564400000.0, 75.3],
      },
      {
        id: '41580187-1a28-4dda-9b31-d23928a7b19b',
        label: '2 foot WC',
        chart: {
          id: '43803e73-2f15-4b34-a707-61b0a57bbb94',
          name: 'PLOT 1 POTATO PLANT AVAILABLE WATER',
          user: {
            username: 'demo',
          },
        },
        last_value: [1709564400000.0, 74.0],
      },
    ],
    graphs: [],
    device: {
      name: 'PLOT 1',
      api: 'Zentra',
      serial: 'z6-07441',
      last_transmission: '2024-03-05T15:00:00-03:00',
      users: [
        {
          username: 'pieterpaulmichau@gmail.com',
        },
        {
          username: 'Benn',
        },
        {
          username: 'Kikko',
        },
        {
          username: 'demometerusa',
        },
        {
          username: 'fperez@agricolasutil.cl',
        },
        {
          username: 'Juan',
        },
        {
          username: 'ashish',
        },
        {
          username: 'SLG',
        },
        {
          username: 'Pagranifo',
        },
        {
          username: 'Gom nam',
        },
        {
          username: 'Sanosvaldo ',
        },
        {
          username: 'Ana',
        },
        {
          username: 'Bae 💝💖',
        },
        {
          username: 'Oktafz',
        },
        {
          username: 'juan1789',
        },
        {
          username: 'AVENTURA',
        },
        {
          username: 'farmer Joe',
        },
        {
          username: 'Gerhard Peters Blatz',
        },
        {
          username: 'Tarahamal ',
        },
        {
          username: 'Takoua',
        },
        {
          username: 'Wahid rafaat',
        },
        {
          username: 'test_user_02',
        },
        {
          username: 'Endless ',
        },
        {
          username: 'Wahidrafaat',
        },
        {
          username: 'Nashimwe',
        },
        {
          username: 'Rabbit Run',
        },
        {
          username: 'Gilbert ',
        },
        {
          username: 'Andawari doutimi ',
        },
        {
          username: 'test_user_12',
        },
        {
          username: 'I love farms 23',
        },
        {
          username: 'Itz obyno ',
        },
        {
          username: 'demo',
        },
        {
          username: 'adel',
        },
        {
          username: 'DIINA NDINELAO ',
        },
        {
          username: 'Nelson',
        },
        {
          username: 'elparque',
        },
        {
          username: 'jsilv0784@gmail.com',
        },
        {
          username: 'testuser',
        },
        {
          username: 'jmw132001',
        },
        {
          username: 'Asha',
        },
        {
          username: 'Rodrigo Barraza ',
        },
        {
          username: 'Hyginus@',
        },
        {
          username: 'isyo',
        },
        {
          username: 'Clobis Ponce',
        },
      ],
      is_lagging: true,
      is_battery_low: false,
      details: {
        battery: 89,
        location: {
          alt: 145.223,
          lat: -41.0830084,
          lng: -70.2105914,
        },
        timezone: 'America/Santiago',
        use_push_api: false,
        download_in_progress: false,
        sensors_without_data: 100,
        no_sensors_without_data: 7,
      },
      plot: null,
      crop: 'POTATO',
    },
    farm: {
      id: 345,
      name: 'Farm 1',
    },
    location_name: '',
    lng: null,
    lat: null,
    use_custom_location: false,
    avg_paw: 74.0,
    marker_map: 4934,
  },
  {
    id: 1898,
    paw_graphs: [
      {
        id: '5d889f5e-ba28-432f-857b-206f7558e28f',
        label: '1 foot WC',
        chart: {
          id: '43803e73-2f15-4b34-a707-61b0a57bbb94',
          name: 'PLOT 1 POTATO PLANT AVAILABLE WATER',
          user: {
            username: 'demo',
          },
        },
        last_value: [1709564400000.0, 75.3],
      },
      {
        id: '41580187-1a28-4dda-9b31-d23928a7b19b',
        label: '2 foot WC',
        chart: {
          id: '43803e73-2f15-4b34-a707-61b0a57bbb94',
          name: 'PLOT 1 POTATO PLANT AVAILABLE WATER',
          user: {
            username: 'demo',
          },
        },
        last_value: [1709564400000.0, 74.0],
      },
    ],
    graphs: [],
    device: {
      name: 'PLOT 1',
      api: 'Zentra',
      serial: 'z6-07441',
      last_transmission: '2024-03-05T15:00:00-03:00',
      users: [
        {
          username: 'pieterpaulmichau@gmail.com',
        },
        {
          username: 'Benn',
        },
        {
          username: 'Kikko',
        },
        {
          username: 'demometerusa',
        },
        {
          username: 'fperez@agricolasutil.cl',
        },
        {
          username: 'Juan',
        },
        {
          username: 'ashish',
        },
        {
          username: 'SLG',
        },
        {
          username: 'Pagranifo',
        },
        {
          username: 'Gom nam',
        },
        {
          username: 'Sanosvaldo ',
        },
        {
          username: 'Ana',
        },
        {
          username: 'Bae 💝💖',
        },
        {
          username: 'Oktafz',
        },
        {
          username: 'juan1789',
        },
        {
          username: 'AVENTURA',
        },
        {
          username: 'farmer Joe',
        },
        {
          username: 'Gerhard Peters Blatz',
        },
        {
          username: 'Tarahamal ',
        },
        {
          username: 'Takoua',
        },
        {
          username: 'Wahid rafaat',
        },
        {
          username: 'test_user_02',
        },
        {
          username: 'Endless ',
        },
        {
          username: 'Wahidrafaat',
        },
        {
          username: 'Nashimwe',
        },
        {
          username: 'Rabbit Run',
        },
        {
          username: 'Gilbert ',
        },
        {
          username: 'Andawari doutimi ',
        },
        {
          username: 'test_user_12',
        },
        {
          username: 'I love farms 23',
        },
        {
          username: 'Itz obyno ',
        },
        {
          username: 'demo',
        },
        {
          username: 'adel',
        },
        {
          username: 'DIINA NDINELAO ',
        },
        {
          username: 'Nelson',
        },
        {
          username: 'elparque',
        },
        {
          username: 'jsilv0784@gmail.com',
        },
        {
          username: 'testuser',
        },
        {
          username: 'jmw132001',
        },
        {
          username: 'Asha',
        },
        {
          username: 'Rodrigo Barraza ',
        },
        {
          username: 'Hyginus@',
        },
        {
          username: 'isyo',
        },
        {
          username: 'Clobis Ponce',
        },
      ],
      is_lagging: true,
      is_battery_low: false,
      details: {
        battery: 89,
        location: {
          alt: 145.223,
          lat: -41.0850084,
          lng: -73.3005914,
        },
        timezone: 'America/Santiago',
        use_push_api: false,
        download_in_progress: false,
        sensors_without_data: 100,
        no_sensors_without_data: 7,
      },
      plot: null,
      crop: 'POTATO',
    },
    farm: {
      id: 346,
      name: 'Farm 2',
    },
    location_name: '',
    lng: null,
    lat: null,
    use_custom_location: false,
    avg_paw: 74.0,
    marker_map: 4934,
  },
  {
    id: 1897,
    paw_graphs: [
      {
        id: '5d889f5e-ba28-432f-857b-206f7558e28f',
        label: '1 foot WC',
        chart: {
          id: '43803e73-2f15-4b34-a707-61b0a57bbb94',
          name: 'PLOT 1 POTATO PLANT AVAILABLE WATER',
          user: {
            username: 'demo',
          },
        },
        last_value: [1709564400000.0, 75.3],
      },
      {
        id: '41580187-1a28-4dda-9b31-d23928a7b19b',
        label: '2 foot WC',
        chart: {
          id: '43803e73-2f15-4b34-a707-61b0a57bbb94',
          name: 'PLOT 1 POTATO PLANT AVAILABLE WATER',
          user: {
            username: 'demo',
          },
        },
        last_value: [1709564400000.0, 74.0],
      },
    ],
    graphs: [],
    device: {
      name: 'PLOT 283',
      api: 'Zentra',
      serial: 'z6-0742000',
      last_transmission: '2024-03-05T15:00:00-03:00',
      users: [
        {
          username: 'pieterpaulmichau@gmail.com',
        },
        {
          username: 'Benn',
        },
        {
          username: 'Kikko',
        },
        {
          username: 'demometerusa',
        },
        {
          username: 'fperez@agricolasutil.cl',
        },
        {
          username: 'Juan',
        },
        {
          username: 'ashish',
        },
        {
          username: 'SLG',
        },
        {
          username: 'Pagranifo',
        },
        {
          username: 'Gom nam',
        },
        {
          username: 'Sanosvaldo ',
        },
        {
          username: 'Ana',
        },
        {
          username: 'Bae 💝💖',
        },
        {
          username: 'Oktafz',
        },
        {
          username: 'juan1789',
        },
        {
          username: 'AVENTURA',
        },
        {
          username: 'farmer Joe',
        },
        {
          username: 'Gerhard Peters Blatz',
        },
        {
          username: 'Tarahamal ',
        },
        {
          username: 'Takoua',
        },
        {
          username: 'Wahid rafaat',
        },
        {
          username: 'test_user_02',
        },
        {
          username: 'Endless ',
        },
        {
          username: 'Wahidrafaat',
        },
        {
          username: 'Nashimwe',
        },
        {
          username: 'Rabbit Run',
        },
        {
          username: 'Gilbert ',
        },
        {
          username: 'Andawari doutimi ',
        },
        {
          username: 'test_user_12',
        },
        {
          username: 'I love farms 23',
        },
        {
          username: 'Itz obyno ',
        },
        {
          username: 'demo',
        },
        {
          username: 'adel',
        },
        {
          username: 'DIINA NDINELAO ',
        },
        {
          username: 'Nelson',
        },
        {
          username: 'elparque',
        },
        {
          username: 'jsilv0784@gmail.com',
        },
        {
          username: 'testuser',
        },
        {
          username: 'jmw132001',
        },
        {
          username: 'Asha',
        },
        {
          username: 'Rodrigo Barraza ',
        },
        {
          username: 'Hyginus@',
        },
        {
          username: 'isyo',
        },
        {
          username: 'Clobis Ponce',
        },
      ],
      is_lagging: true,
      is_battery_low: false,
      details: {
        battery: 89,
        location: {
          alt: 145.223,
          lat: -41.0850084,
          lng: -73.3205914,
        },
        timezone: 'America/Santiago',
        use_push_api: false,
        download_in_progress: false,
        sensors_without_data: 100,
        no_sensors_without_data: 7,
      },
      plot: null,
      crop: 'POTATO',
    },
    farm: {
      id: 346,
      name: 'Farm 2',
    },
    location_name: '',
    lng: null,
    lat: null,
    use_custom_location: false,
    avg_paw: 29.0,
    marker_map: 4934,
  },
  {
    id: 1896,
    paw_graphs: [
      {
        id: '5d889f5e-ba28-432f-857b-206f7558e28f',
        label: '1 foot WC',
        chart: {
          id: '43803e73-2f15-4b34-a707-61b0a57bbb94',
          name: 'PLOT 1 POTATO PLANT AVAILABLE WATER',
          user: {
            username: 'demo',
          },
        },
        last_value: [1709564400000.0, 75.3],
      },
      {
        id: '41580187-1a28-4dda-9b31-d23928a7b19b',
        label: '2 foot WC',
        chart: {
          id: '43803e73-2f15-4b34-a707-61b0a57bbb94',
          name: 'PLOT 1 POTATO PLANT AVAILABLE WATER',
          user: {
            username: 'demo',
          },
        },
        last_value: [1709564400000.0, 74.0],
      },
    ],
    graphs: [],
    device: {
      name: 'PLOT 1',
      api: 'Zentra',
      serial: 'z6-07441',
      last_transmission: '2024-03-05T15:00:00-03:00',
      users: [
        {
          username: 'pieterpaulmichau@gmail.com',
        },
        {
          username: 'Benn',
        },
        {
          username: 'Kikko',
        },
        {
          username: 'demometerusa',
        },
        {
          username: 'fperez@agricolasutil.cl',
        },
        {
          username: 'Juan',
        },
        {
          username: 'ashish',
        },
        {
          username: 'SLG',
        },
        {
          username: 'Pagranifo',
        },
        {
          username: 'Gom nam',
        },
        {
          username: 'Sanosvaldo ',
        },
        {
          username: 'Ana',
        },
        {
          username: 'Bae 💝💖',
        },
        {
          username: 'Oktafz',
        },
        {
          username: 'juan1789',
        },
        {
          username: 'AVENTURA',
        },
        {
          username: 'farmer Joe',
        },
        {
          username: 'Gerhard Peters Blatz',
        },
        {
          username: 'Tarahamal ',
        },
        {
          username: 'Takoua',
        },
        {
          username: 'Wahid rafaat',
        },
        {
          username: 'test_user_02',
        },
        {
          username: 'Endless ',
        },
        {
          username: 'Wahidrafaat',
        },
        {
          username: 'Nashimwe',
        },
        {
          username: 'Rabbit Run',
        },
        {
          username: 'Gilbert ',
        },
        {
          username: 'Andawari doutimi ',
        },
        {
          username: 'test_user_12',
        },
        {
          username: 'I love farms 23',
        },
        {
          username: 'Itz obyno ',
        },
        {
          username: 'demo',
        },
        {
          username: 'adel',
        },
        {
          username: 'DIINA NDINELAO ',
        },
        {
          username: 'Nelson',
        },
        {
          username: 'elparque',
        },
        {
          username: 'jsilv0784@gmail.com',
        },
        {
          username: 'testuser',
        },
        {
          username: 'jmw132001',
        },
        {
          username: 'Asha',
        },
        {
          username: 'Rodrigo Barraza ',
        },
        {
          username: 'Hyginus@',
        },
        {
          username: 'isyo',
        },
        {
          username: 'Clobis Ponce',
        },
      ],
      is_lagging: true,
      is_battery_low: false,
      details: {
        battery: 89,
        location: {
          alt: 145.223,
          lat: -40.0820084,
          lng: -72.3005914,
        },
        timezone: 'America/Santiago',
        use_push_api: false,
        download_in_progress: false,
        sensors_without_data: 100,
        no_sensors_without_data: 7,
      },
      plot: null,
      crop: 'POTATO',
    },
    farm: {
      id: 345,
      name: 'Farm 1',
    },
    location_name: '',
    lng: null,
    lat: null,
    use_custom_location: false,
    avg_paw: 74.0,
    marker_map: 4934,
  },
];

export const getMarkers = async () => {
  const response = await fetchWrapper(`${API_URL}marker/primary/`);
  return response.json();
  // return DUMMY_RESPONSE;
};


// get a single marker
export const getMarkerById = async (id) => {
  const response = await fetchWrapper(`${API_URL}marker/${id}/`);
  return response.json();
};



export const createMarker = async (data) => {
  const response = await fetchWrapper(`${API_URL}marker/`, {
    method: 'POST',
    body: JSON.stringify(data),
    // set type to json
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return response.json();
  }
};


export const updateMarker = async (updatedMarker) => {
  console.log("udpatedMarker", updatedMarker);
    const response = await fetchWrapper(`${API_URL}marker/${updatedMarker.id}/`, {
      method: 'PUT',
      body: JSON.stringify(updatedMarker),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return response.json();
    }
} 

export const getPawData = async (markerId) => {
  const response = await fetchWrapper(`${API_URL}marker/paw/${markerId}/`);
  return response.json();
};

export const getStations = async () => {
  const response = await fetchWrapper(`${API_URL}station/`);
  return response.json();
};
