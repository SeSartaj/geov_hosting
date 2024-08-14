import * as Tabs from '@radix-ui/react-tabs';
import Tooltip from '../Tooltip';

export function TabTrigger({ value, children, tooltipText, portalContainer }) {
  return (
    <Tabs.Trigger
      className={`font-inherit px-2 h-[30px] flex items-center justify-center text-[15px] leading-none 
        text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-pointer hover:text-gray-800 hover:bg-gray-300
        focus:outline-none  focus:font-bold border border-gray-500 border-solid data-[state=active]:border-none
        data-[state=active]:text-black dark:data-[state=active]:text-gray-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 `}
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
      className='flex flex-col flex-1 p-[10px] overflow-scroll state-inactive:hidden bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200'
      value={value}
    >
      {children}
    </Tabs.Content>
  );
}
