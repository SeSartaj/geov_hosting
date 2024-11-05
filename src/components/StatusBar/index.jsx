import useMapStore from '@/stores/mapStore';
import { useEffect } from 'react';

const StatusBar = () => {
  const viewMode = useMapStore((state) => state.viewMode);
  const cursorCords = useMapStore((state) => state.cursorCords);
  const hoveredValue = useMapStore((state) => state.hoveredValue);

  console.log('hoveredValue', hoveredValue);
  return (
    <div className="absolute bottom-0 left-0 w-full  bg-black bg-opacity-50 p-1 text-xs text-white flex justify-between">
      <span>mode: {viewMode}</span>
      {viewMode === 'PICKER' && (
        <span>
          {hoveredValue && (
            <span>
              <span>
                {hoveredValue.label}:{hoveredValue?.value && hoveredValue.value}
              </span>
              <div
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: hoveredValue.color,
                  display: 'inline-block',
                }}
              ></div>
            </span>
          )}
          &nbsp;
          <span>
            {`${cursorCords[0].toFixed(6)}, ${cursorCords[1].toFixed(6)}`}
          </span>
        </span>
      )}
    </div>
  );
};

export default StatusBar;
