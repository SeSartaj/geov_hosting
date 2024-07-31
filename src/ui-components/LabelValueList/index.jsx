import './styles.css';

function LabelValueList({ list = [] }) {
  return (
    <div className='label-value-list'>
      {list.map(({ label, value }) => (
        <span className='label-value-item' key={label}>
          <span className='lvi-label'>{label}: </span>
          <span className='lvi-value'>{value}</span>
        </span>
      ))}
    </div>
  );
}

export default LabelValueList;
