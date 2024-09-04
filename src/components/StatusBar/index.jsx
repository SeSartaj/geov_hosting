import useMapStore from '@/stores/mapStore';

const StatusBar = () => {
  const viewMode = useMapStore((state) => state.viewMode);
  const cursorCords = useMapStore((state) => state.cursorCords);

  return (
    <div className='absolute bottom-0 left-0 w-full  bg-black bg-opacity-50 p-1 text-xs text-white flex justify-between'>
      <span>mode: {viewMode}</span>
      {viewMode === 'PICKER' && (
        <span>{`${cursorCords[0].toFixed(6)}, ${cursorCords[1].toFixed(
          6
        )}`}</span>
      )}
    </div>
  );
};

export default StatusBar;
