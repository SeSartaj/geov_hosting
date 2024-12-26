import FormGroup, { FormErrorMessage } from '@/ui-components/FormGroup';
import Input from '@/ui-components/Input';
import MyButton from '@/ui-components/MyButton';
import { useRef, useState } from 'react';

const emptyValues = {
  name: '',
};

export default function PlotForm({
  onSubmit,
  onCancel,
  initialValues = {},
  plot,
  submitButtonText = 'Edit Plot',
}) {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState();

  const formRef = useRef();

  const serializeData = (formData) => {
    const data = {
      name: formData.name,
    };

    if (formData?.id) data.id = formData.id;
    if (formData.name) data.device = formData.name;
    return data;
  };

  const deserializeData = (data) => {
    return {
      ...emptyValues,
      id: data.id,
      name: data.name,
      ...initialValues,
    };
  };

  const deserializedData = plot ? deserializeData(plot) : {};
  // if user doesn't include all values in initialValues, emptyValues will be used
  const [formData, setFormData] = useState({ ...deserializedData });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    onSubmit(serializeData(formData))
      .catch((error) => {
        console.log('error in form is', error);
        setFormError(error);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <form onSubmit={handleSubmit} className="p-4" ref={formRef}>
      <div className="flex flex-col gap-1 ">
        <FormGroup label="Name:">
          <Input
            className="w-full"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            name="name"
          />
        </FormGroup>
      </div>

      <FormErrorMessage error={formError} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <MyButton color="mute" onClick={onCancel}>
          Cancel
        </MyButton>
        <MyButton type="submit" disabled={submitting} color="primary">
          {submitting ? 'loading ...' : submitButtonText}
        </MyButton>
      </div>
    </form>
  );
}
