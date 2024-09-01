import Label from '../Label';

function FormGroup({ label, children }) {
  return (
    <div className='flex items-center w-full mb-1'>
      <Label className='w-1/4'>{label}</Label>
      <div className='flex-grow'>{children}</div>
    </div>
  );
}

export default FormGroup;
