import {
  BiCaretDown,
  BiCaretRight,
  BiDockBottom,
  BiDockRight,
  BiRightIndent,
} from 'react-icons/bi';
import { AccordionItem } from '../Accordion';
import './styles.css';

function LabelValueList({ list = [], itemClasses, className }) {
  return (
    <div
      className={`label-value-list dark:text-gray-100 text-gray-900 font-bold  ${
        className ? className : ''
      }`}
    >
      {list.map(({ label, value, variant, labelEnd }) => {
        if (variant == 'collapsable') {
          return (
            <div
              className={`block-label-value-item mb-1 dark:border-gray-500 ${itemClasses}`}
              key={label}
            >
              <AccordionItem
                key={label}
                label={({ show, setShow }) => (
                  <span className="lvi-label dark:text-gray-400 flex items-center justify-between">
                    <span
                      className="flex items-center cursor-pointer select-none"
                      onClick={() => setShow(!show)}
                    >
                      {show ? <BiCaretDown /> : <BiCaretRight />}
                      {label}
                    </span>
                    <span>{labelEnd && labelEnd}</span>
                  </span>
                )}
              >
                {value}
              </AccordionItem>
            </div>
          );
        }
        if (variant === 'block') {
          return (
            <div className="block-label-value-item " key={label}>
              <span className="lvi-label dark:text-gray-400">{label}: </span>
              <br />
              <span className="lvi-value dark:text-gray-100">{value}</span>
            </div>
          );
        } else {
          return (
            <span className="label-value-item" key={label}>
              <span className="lvi-label dark:text-gray-400">{label}: </span>
              <span className="lvi-value dark:text-gray-100">{value}</span>
            </span>
          );
        }
      })}
    </div>
  );
}

export default LabelValueList;
