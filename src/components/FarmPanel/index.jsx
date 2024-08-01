import MyButton from '../../ui-components/MyButton';

export default function FarmPanel() {
  return (
    <div className='panel-container'>
      <div className='panel-header-action'>
        <h3 style={{ margin: 0 }}>Farms</h3>
        <MyButton>Add New Farm</MyButton>
      </div>
    </div>
  );
}
