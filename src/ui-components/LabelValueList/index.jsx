import {
  BiCaretDown,
  BiCaretRight,
  BiDockBottom,
  BiDockRight,
  BiRightIndent,
} from 'react-icons/bi';
import { AccordionItem } from '../Accordion';
import './styles.css';

function LabelValueList({ list = [] }) {
  return (
    <div className='label-value-list'>
      {list.map(({ label, value, variant }) => {
        if (variant == 'collapsable') {
          return (
            <div className='block-label-value-item ' key={label}>
              <AccordionItem
                key={label}
                label={({ show, setShow }) => (
                  <span
                    className='lvi-label dark:text-gray-400 flex items-center cursor-pointer'
                    onClick={() => setShow(!show)}
                  >
                    {show ? <BiCaretDown /> : <BiCaretRight />}
                    {label}
                  </span>
                )}
              >
                <span className='lvi-value dark:text-gray-100'>{value}</span>
              </AccordionItem>
            </div>
          );
        }
        if (variant === 'block') {
          return (
            <div className='block-label-value-item ' key={label}>
              <span className='lvi-label dark:text-gray-400'>{label}: </span>
              <br />
              <span className='lvi-value dark:text-gray-100'>{value}</span>
            </div>
          );
        } else {
          return (
            <span className='label-value-item' key={label}>
              <span className='lvi-label dark:text-gray-400'>{label}: </span>
              <span className='lvi-value dark:text-gray-100'>{value}</span>
            </span>
          );
        }
      })}
    </div>
  );
}

export default LabelValueList;
