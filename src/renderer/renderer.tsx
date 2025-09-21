import { render } from 'solid-js/web'
import './style.css'
import { HashRouter, Route } from '@solidjs/router'
import BookList from './components/booklist'
import Layout from './components/layout'
import Reading from './components/reading'
import { EventBusProvider } from './context/EventBusProvider'

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
