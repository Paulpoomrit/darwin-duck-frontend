import { NavBar } from '../../../src/components/nav-bar/nav-bar';
import { ContentSlot, createBoard } from '@wixc3/react-board';
import { ComponentWrapper } from '_codux/wrappers/component-wrapper';

export default createBoard({
    name: 'NavBar',
    Board: () => (
        <ComponentWrapper>
            <ContentSlot>
                <NavBar />
            </ContentSlot>
        </ComponentWrapper>
    ),
    environmentProps: {
        windowHeight: 908,
        windowWidth: 1555,
    },
});
