import { Button } from '@/components/ui/button';
import FormGroup, { FormErrorMessage } from '@/ui-components/FormGroup';
import Input from '@/ui-components/Input';
import MyButton from '@/ui-components/MyButton';
import MyReactSelect from '@/ui-components/MyReactSelect';
import { useEffect, useRef, useState } from 'react';
import { getFarmOptions } from '@/api/farmApi';
import getSelectedValues from '@/utils/getSelectedValues';
import { BiGlobeAlt } from 'react-icons/bi';

const emptyValues = {
  name: '',
};

export default function PlotForm({
  onSubmit,
  onCancel,
  onGeometryChange,
  initialValues = {},
  plot,
  submitButtonText = 'Edit Plot',
}) {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState();
  const [farm, setFarm] = useState(plot.farm);
  const [farmOptions, setFarmOptions] = useState([]);
  const [farmsLoading, setFarmsLoading] = useState(false);

  const formRef = useRef();

  const serializeData = (formData) => {
    console.log('data comming to serialize', formData);
    const data = {
      name: formData.name,
      farm: formData?.farm?.value || formData.farm?.id || formData?.farm,
    };

    if (formData?.id) data.id = formData.id;
    // if (formData.name) data.device = formData.name;
    console.log('serialized data', data);
    return data;
  };

  console.log('plot ', plot);

  const deserializeData = (data) => {
    return {
      ...emptyValues,
      id: data.id,
      name: data.name,
      farm: data.farm,
      ...initialValues,
    };
  };

  const deserializedData = plot ? deserializeData(plot) : {};
  console.log('deserializedData', deserializedData);
  // if user doesn't include all values in initialValues, emptyValues will be used
  const [formData, setFormData] = useState({ ...deserializedData });

  console.log('formData', formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(serializeData(formData));
    } catch (error) {
      console.log('error in form is', error);
      setFormError(error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setFarmsLoading(true);
    getFarmOptions()
      .then((options) => {
        setFarmOptions(options);
      })
      .finally(() => {
        setFarmsLoading(false);
      });
  }, []);

  return (
    <form onSubmit={handleSubmit} className="p-4" ref={formRef}>
      <FormGroup label="Name:">
        <Input
          type="text"
          name="name"
          className="w-full"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </FormGroup>
      <FormGroup label="Farm">
        <MyReactSelect
          className="w-full"
          value={getSelectedValues(formData.farm, farmOptions)}
          options={farmOptions}
          onChange={(f) => setFormData({ ...formData, farm: f })}
          isClearable={true}
          formRef={formRef}
          // isLoading={farmsLoading}
        />
      </FormGroup>

      <FormErrorMessage error={formError} />
      <div className="flex justify-between">
        <div>
          <Button variant="outline" onClick={onGeometryChange}>
            <BiGlobeAlt />
            Change Shape
          </Button>
        </div>
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'saving ...' : submitButtonText}
          </Button>
        </div>
      </div>
    </form>
  );
}
