import { ContentSlot, createBoard } from '@wixc3/react-board';
import { PopUpModalComponent } from '../../../src/components/pop-up-modal-component/pop-up-modal-component';
import { ComponentWrapper } from '_codux/wrappers/component-wrapper';

export default createBoard({
    name: 'PopUpModalComponent',
    Board: () => (
        <ComponentWrapper>
            <ContentSlot>
                <PopUpModalComponent />
            </ContentSlot>
        </ComponentWrapper>
    ),
    environmentProps: {
        windowWidth: 1184.5318202193866,
        windowHeight: 946.2340898903067,
    },
});
