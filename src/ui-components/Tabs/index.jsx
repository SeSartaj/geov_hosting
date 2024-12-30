import PropTypes from 'prop-types';
import './styles.css';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Tooltip from '@/ui-components/Tooltip';
import { Card } from '@/components/ui/card';

export function TabTrigger({ value, children, tooltipText, ...props }) {
  return (
    <Tooltip text={tooltipText}>
      <TabsTrigger value={value} {...props}>
        {children}
      </TabsTrigger>
    </Tooltip>
  );
}

export function TabContent({ value, children }) {
  return (
    <TabsContent
      // className="flex flex-col flex-1 h-full overflow-auto state-inactive:hidden bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
      value={value}
    >
      {children}
    </TabsContent>
  );
}

export const MyTabs = ({
  tabs = [],
  defaultId,
  ariaLabel = 'tabs',
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
      <Card>{tab.content}</Card>
    </TabContent>
  ),
}) => (
  <Tabs
    // className="flex flex-col w-full h-full overflow-y-hidden"
    defaultValue={defaultId}
    activationMode="manual"
  >
    <TabsList className="grid w-full grid-cols-2" aria-label={ariaLabel}>
      {tabs.map(renderTrigger)}
    </TabsList>
    {tabs.map(renderContent)}
  </Tabs>
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
