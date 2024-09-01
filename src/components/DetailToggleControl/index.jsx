import { BiPlus } from 'react-icons/bi';
import { useControl } from 'react-map-gl/maplibre';

const MyPlusIcon = () => {
  return <BiPlus />;
};
function DetailViewControl(props) {
  useControl(
    () => {
      return {
        onAdd: () => {
          return <MyPlusIcon />;
        },
        onRemove: () => {
          return null;
        },
      };
    },
    {
      position: props.position,
    }
  );
}

export default DetailViewControl;
