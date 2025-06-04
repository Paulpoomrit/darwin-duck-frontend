import { WebGLComponent } from '../../../src/components/web-gl-component/web-gl-component';
import { ContentSlot, createBoard } from '@wixc3/react-board';
import { ComponentWrapper } from '_codux/wrappers/component-wrapper';

export default createBoard({
    name: 'WebGLComponent',
    Board: () => (
        <ComponentWrapper>
            <ContentSlot>
                <WebGLComponent />
            </ContentSlot>
        </ComponentWrapper>
    ),
    environmentProps: {
        windowWidth: 3013,
        windowHeight: 969,
    },
});
