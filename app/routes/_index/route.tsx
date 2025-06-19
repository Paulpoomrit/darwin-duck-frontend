import { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { getUrlOriginWithPath } from '~/utils';
import styles from './_index.module.scss';
import classes from './route.module.scss';
import { ToolBar } from '../../../src/components/tool-bar/tool-bar';
import { NavBar } from '../../../src/components/nav-bar/nav-bar';
import { WebGLComponent } from '../../../src/components/web-gl-component/web-gl-component';
import { StatPanelComponent } from '../../../src/components/stat-panel-component/stat-panel-component';
import { ToDoListComponent } from '../../../src/components/to-do-list-component/to-do-list-component';
import DarwinLogo from '../../../src/assets/img/DarwinDuckOnlyIcon.png';
import { DuckStates } from '~/components/web-gl-component/ThreeJSModules/enums';

export const loader = ({ request }: LoaderFunctionArgs) => {
    return { canonicalUrl: getUrlOriginWithPath(request.url) };
};

export default function HomePage() {
    return (
        <div className={styles.darwinduckmainapp}>
            <div className={styles.navbarcomponent}>
                <NavBar />
            </div>

            <div className={styles.toolbarcomponentIcon}>
                <ToolBar />
            </div>

            <div className={styles.webglcomponent}>
                <WebGLComponent nextState={DuckStates.IDLE}/>
            </div>

            <div className={styles.statspanelcomponent}>
                <StatPanelComponent />
            </div>

            <div className={styles.todolistcomponent}>
                <ToDoListComponent />
            </div>
        </div>
    );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    const title = 'Darwin The Duck';
    const description = 'Your AI Study Buddy!';
    const imageUrl = DarwinLogo;

    return [
        { title },
        {
            name: 'description',
            content: description,
        },
        {
            tagName: 'link',
            rel: 'canonical',
            href: data?.canonicalUrl,
        },
        {
            property: 'robots',
            content: 'index, follow',
        },
        {
            property: 'og:title',
            content: title,
        },
        {
            property: 'og:description',
            content: description,
        },
        {
            property: 'og:image',
            content: imageUrl,
        },
        {
            name: 'twitter:card',
            content: 'summary_large_image',
        },
        {
            name: 'twitter:title',
            content: title,
        },
        {
            name: 'twitter:description',
            content: description,
        },
        {
            name: 'twitter:image',
            content: imageUrl,
        },
    ];
};

export const links: LinksFunction = () => {
    return [
        {
            rel: 'icon',
            href: '/favicon.ico',
            type: 'image/ico',
        },
    ];
};
