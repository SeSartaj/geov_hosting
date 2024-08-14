import Label from '../Label';

function FormGroup({ label, children }) {
  return (
    <div className='inline-flex items-center space-x-2 w-full'>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export default FormGroup;
