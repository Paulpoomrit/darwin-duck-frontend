import { ToolBar } from '../../../src/components/tool-bar/tool-bar';
import { ContentSlot, createBoard } from '@wixc3/react-board';
import { ComponentWrapper } from '_codux/wrappers/component-wrapper';

export default createBoard({
    name: 'ToolBar',
    Board: () => (
        <ComponentWrapper>
            <ContentSlot>
                <ToolBar />
            </ContentSlot>
        </ComponentWrapper>
    ),
    environmentProps: {
        windowWidth: 1398.174298413978,
        windowHeight: 1080,
    },
});
