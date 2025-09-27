import { render } from 'solid-js/web'
import './style.css'
import { HashRouter, Route } from '@solidjs/router'
import { EventBusProvider } from './context/EventBusProvider'
import BookList from './pages/booklist'
import Layout from './pages/layout'
import Reading from './pages/reading'

const root = document.getElementById('root') as HTMLElement

const router = () => (
    <EventBusProvider>
        <HashRouter root={Layout}>
            <Route path='/' component={BookList} />
            <Route path='/reading' component={Reading} />
        </HashRouter>
    </EventBusProvider>
)

render(router, root)
