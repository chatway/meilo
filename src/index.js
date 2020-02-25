import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDOM from 'react-dom';
import connect from '@vkontakte/vk-connect';
import App from './App';
import { RouterProvider } from 'react-router5'
import createRouter from './create-router'

connect.send('VKWebAppInit', {});

let location = Object.assign({}, window.location) // сохраняем данные в переменную, чтобы проверить пользователя на самозванца
const router = createRouter()
router.start(() => {
    ReactDOM.render((
        <RouterProvider router={router}>
            <App router={router} location={location}/>
        </RouterProvider>
    ), document.getElementById('root'))
})
