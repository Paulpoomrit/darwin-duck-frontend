import { ToDoListComponent } from '../../../src/components/to-do-list-component/to-do-list-component';
import { ContentSlot, createBoard } from '@wixc3/react-board';
import { ComponentWrapper } from '_codux/wrappers/component-wrapper';

export default createBoard({
    name: 'ToDoListComponent',
    Board: () => (
        <ComponentWrapper>
            <ContentSlot>
                <ToDoListComponent />
            </ContentSlot>
        </ComponentWrapper>
    ),
    environmentProps: {
        windowWidth: 915,
    },
});
