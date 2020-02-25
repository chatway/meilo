import React from 'react'
import { View, Panel, Root } from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import AddTask from './components/tasks/AddTask'
import { RouteNode } from 'react-router5'
import './custom.css'
import TasksPanel from "./components/tasks/TasksPanel";
import MailingGroupsPanel from "./components/mailing_groups/MailingGroupsPanel";
import connect from '@vkontakte/vk-connect';
import {APIDOMAIN} from "./components/app/types";

class App extends React.Component {
	constructor(props) {

		super(props)

		this.state = {
			tasks : [ 
				{	
					id : 1,
					name : 'Домашнее задание',
					text : 'Сделать математику к школе'
				},
				{
					id : 2,
					name : 'Выпить воду',
					text : 'Буду пить воду каждый час'
				}
			],
			search : '',
			removable : false,
			mailingGroups: [
				/*{
					id: 1,
					title: "Получить подарок"
				},
				{
					id: 2,
					title: "Получить подарок"
				}*/
			],
			allowMessagesGroupList: [],
			mailingGroup: null,
			client: null,
			queryParams: null,
			sendMessage: false,
			sendNotification: false,
			signChatWay: null
		}

	}
	parseQueryString = (string) => {
		return string.slice(1).split('&')
			.map((queryParam) => {
				let kvp = queryParam.split('=');
				return {key: kvp[0], value: kvp[1]}
			})
			.reduce((query, kvp) => {
				query[kvp.key] = kvp.value;
				return query
			}, {})
	};
	async getSignClient() {
		let queryParams = decodeURI(this.props.location.search).replace(/%2C/g, ',')
		return fetch(APIDOMAIN + '/app_vk/app_vk/check-user',
			{
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(this.parseQueryString(queryParams))
			})
			.then(function (response) {
				return response.json();
			})
	}
	async loadMailingGroups() {
		return fetch(APIDOMAIN + '/app_vk/app_vk/all-by-group-id/' + this.state.queryParams.vk_user_id + '?group_id=' + this.state.queryParams.vk_group_id + '&sign=' + this.state.signChatWay)
			.then(function (response) {
				return response.json()
			})
	}
	async loadAllowMessagesGroupList() {
		return fetch(APIDOMAIN + '/app_vk/app_vk/get-user-allow-group-list/' + this.state.queryParams.vk_user_id + '?group_id=' + this.state.queryParams.vk_group_id + '&sign=' + this.state.signChatWay)
			.then(function (response) {
				return response.json()
			})
	}

	componentDidMount() {
		connect
			.send('VKWebAppGetUserInfo')
			.then(data => {
				this.setState({client: data})
			})
			// eslint-disable-next-line handle-callback-err
			.catch(error => {
				// Обработка событияв случае ошибки
			})
		this.setState({ queryParams: this.parseQueryString(this.props.location.search)})
		this.getSignClient()
			.then((response) => {
				if (response.hasOwnProperty('type') && response.type === 'success') {
					this.setState({ signChatWay: response.sign })
					this.loadAllowMessagesGroupList().then((data) => {
						this.setState({ allowMessagesGroupList: data.data })
					})
					this.loadMailingGroups().then((data) => {
						this.setState({ mailingGroups: data.data })

					})
				}
			})
	}

	addTask = (task) => {
		task.id = this.state.tasks.length + 1
		this.setState({
			tasks : [...this.state.tasks, task]
		})
	}

	deleteTask = (id) => {
		let newTasks = this.state.tasks.filter((task) => task.id !== id)
		this.setState({ 
			tasks : newTasks
		})
	}

	onRemovableTasks = () => this.setState({ removable : !this.state.removable })


	editTask = (newTask) => {
		let newTasks = this.state.tasks.map((task) => {
			if (task.id === newTask.id) {
				task = newTask
			}
			return task
		})
		this.setState({
			tasks : newTasks
		})
	}

	get tasks () {
		const search = this.state.search.toLowerCase()
		return this.state.tasks.filter((task) => 
			task.name.toLowerCase().indexOf(search) > -1 || 
			task.text.toLowerCase().indexOf(search) > -1)
	}
	get mailingGroups () {
		return this.state.mailingGroups
	}
	subscribe = (params) => {
		let mailingGroupId = params.mailingGroupId
		let subscribe = params.subscribe
		let applySubscribe = true
		if (subscribe && this.state.queryParams.vk_group_id !== null) {
			connect
				.send('VKWebAppAllowMessagesFromGroup',
					{ 'group_id': +this.state.queryParams.vk_group_id, 'key': 'dBuBKe1kFcdemzB' })
				.then(data => {
					if (data.result) {
						applySubscribe = data.result
					}
				})
				.catch(error => {
					console.log('Запрос VKWebAppAllowMessagesFromGroup прошел с ошибкой', error)
				})
		}
		if (!applySubscribe) { return }
		let dispatchText = (subscribe ? 'subscribe-client/' : 'unsubscribe-client/')

		fetch(APIDOMAIN + '/app_vk/app_vk/' + dispatchText + this.state.queryParams.vk_user_id + '?mailing_group_id=' + mailingGroupId,
			{
				method: "GET",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			})
			.then((res) => {
				return res.json();
			})
			.then( response => {
				// return response
				this.subscribeClient(response, subscribe, mailingGroupId)
			})
	}

	subscribeClient = (response, subscribe, mailingGroupId) => {
		if (response !== undefined && response.hasOwnProperty('success')) {
			let allowMessagesGroupList = [...this.state.allowMessagesGroupList];
			if (subscribe) {
				allowMessagesGroupList.push(mailingGroupId);
				this.setState({allowMessagesGroupList});

			} else {
				let index = allowMessagesGroupList.indexOf(mailingGroupId)
				if (index !== -1) {
					allowMessagesGroupList.splice(index, 1)
					this.setState({allowMessagesGroupList});
				}
			}
		}
	}

	render() {

		let {
			route,
			router
		} = this.props
		const activeView = (route.name === 'add') ? 'addView' : (route.name === 'mailing_groups' || route.name === 'mailing_group' ? 'mailingGroupsView' : 'tasksView')
		const activePanel = route.name

		return (
			<Root activeView={activeView}>
				<TasksPanel
					route={this.props.route}
					id='tasksView'
					state={this.state}
					router={router}
					tasks={this.tasks}
					onRemovableTasks={this.onRemovableTasks}
					setCurrentTaskId={this.setCurrentTaskId}
					deleteTask={this.deleteTask}
					editTask={this.editTask}
				/>
				<MailingGroupsPanel
					route={this.props.route}
					id='mailingGroupsView'
					state={this.state}
					router={router}
					mailingGroups={this.mailingGroups}
					onRemovableTasks={this.onRemovableTasks}
					setCurrentTaskId={this.setCurrentTaskId}
					deleteTask={this.deleteTask}
					editTask={this.editTask}
					subscribe={this.subscribe}
				/>
				<View activePanel={activePanel} id='addView'>
					<Panel id='add' theme="white">
							<AddTask 
								router={router}
								addTask={this.addTask}
							/>

					</Panel>
				</View>
			</Root>
		)
	}
}

export default (props) => (
    <RouteNode nodeName="">
        {({ route }) => <App route={route} {...props}/>}
    </RouteNode>
)
