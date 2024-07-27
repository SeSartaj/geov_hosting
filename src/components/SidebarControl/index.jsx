import { useControl } from 'react-map-gl';
import Sidebar from '../Sidebar';

export default function SidebarControl(props) {
  useControl(() => <Sidebar {...props} />, {
    position: props.position,
  });
  return null;
}
