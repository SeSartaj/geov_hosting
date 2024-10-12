import Label from '../Label';

function FormGroup({ label,error, children }) {
  return (
    <>
    <div className='flex items-center w-full mb-1'>
      <Label className='w-1/4'>{label}</Label>
      <div className='flex-grow'>{children}</div>
    </div>
    <div className='flex items-center w-full mb-1'>
      <Label className='w-1/4'></Label>
      {error && <small className='flex-grow text-red-500 '>{error?.message || error}</small>}
    </div>
    </>
  );
}

export default FormGroup;
