import * as Tabs from '@radix-ui/react-tabs';
import Tooltip from '../Tooltip';

export function TabTrigger({ value, children, tooltipText, portalContainer }) {
  return (
    <Tabs.Trigger
      className={`font-inherit px-2 h-[30px] flex items-center justify-center text-[15px] leading-none 
        text-gray-600 bg-gray-100 cursor-pointer hover:text-gray-800 hover:bg-gray-300
        focus:outline-none  focus:font-bold border border-gray-300 border-solid data-[state=active]:border-none
        data-[state=active]:text-black data-[state=active]:bg-white `}
      value={value}
    >
      <Tooltip text={tooltipText} portalContainer={portalContainer}>
        {children}
      </Tooltip>
    </Tabs.Trigger>
  );
}

export function TabContent({ value, children }) {
  return (
    <Tabs.Content
      className='flex flex-col flex-1 p-[10px] overflow-scroll state-inactive:hidden bg-white'
      value={value}
    >
      {children}
    </Tabs.Content>
  );
}
