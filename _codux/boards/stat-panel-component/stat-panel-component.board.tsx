import { StatPanelComponent } from '../../../src/components/stat-panel-component/stat-panel-component';
import { ContentSlot, createBoard } from '@wixc3/react-board';
import { ComponentWrapper } from '_codux/wrappers/component-wrapper';

export default createBoard({
    name: 'StatPanelComponent',
    Board: () => (
        <ComponentWrapper>
            <ContentSlot>
                <StatPanelComponent />
            </ContentSlot>
        </ComponentWrapper>
    ),
    environmentProps: {
        windowWidth: 503,
    },
});
