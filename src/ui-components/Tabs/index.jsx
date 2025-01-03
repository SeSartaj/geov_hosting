import PropTypes from 'prop-types';
import './styles.css';

import * as Tabs from '@radix-ui/react-tabs';
import Tooltip from '@/ui-components/Tooltip';

export function TabTrigger({ value, children, tooltipText, ...props }) {
  return (
    <Tooltip text={tooltipText}>
      <Tabs.Trigger
        className={`font-inherit px-2 h-[30px] flex items-center justify-center text-[15px] leading-none 
        text-gray-500 bg-gray-100 dark:bg-gray-600 dark:bg-gray-900 cursor-pointer hover:text-gray-800 hover:bg-gray-300 dark:hover:text-gray-200 dark:hover:bg-gray-800
        focus:outline-none  focus:font-bold  
        data-[state=active]:text-black dark:data-[state=active]:text-gray-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 `}
        value={value}
        {...props}
      >
        {children}
      </Tabs.Trigger>
    </Tooltip>
  );
}

export function TabContent({ value, children }) {
  return (
    <Tabs.Content
      className="flex flex-col flex-1 h-full overflow-auto state-inactive:hidden bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
      value={value}
    >
      {children}
    </Tabs.Content>
  );
}

export const MyTabs = ({
  tabs = [],
  defaultId,
  renderTrigger = (tab) => (
    <TabTrigger
      key={tab.id}
      value={tab.id}
      tooltipText={tab.tooltipText || tab.title}
    >
      {tab.icon || tab.title}
    </TabTrigger>
  ),
  renderContent = (tab) => (
    <TabContent key={tab.id} value={tab.id}>
      {tab.content}
    </TabContent>
  ),
}) => (
  <Tabs.Root
    className="flex flex-col w-full h-full overflow-y-hidden"
    defaultValue={defaultId}
    activationMode="manual"
  >
    <Tabs.List
      className="flex flex-shrink-0 justify-start"
      aria-label="Manage your account"
    >
      {tabs.map(renderTrigger)}
    </Tabs.List>
    {tabs.map(renderContent)}
  </Tabs.Root>
);

MyTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.node,
      content: PropTypes.node.isRequired,
      tooltipText: PropTypes.string,
    })
  ).isRequired,
  defaultId: PropTypes.string.isRequired,
  renderTrigger: PropTypes.func,
  renderContent: PropTypes.func,
};
