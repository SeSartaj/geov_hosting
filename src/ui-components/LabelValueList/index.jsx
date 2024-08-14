import './styles.css';

function LabelValueList({ list = [] }) {
  return (
    <div className='label-value-list'>
      {list.map(({ label, value }) => (
        <span className='label-value-item' key={label}>
          <span className='lvi-label dark:text-gray-400'>{label}: </span>
          <span className='lvi-value dark:text-gray-100'>{value}</span>
        </span>
      ))}
    </div>
  );
}

export default LabelValueList;
