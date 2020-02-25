import React, {Component} from 'react'
import {
    platform,
    ANDROID,
    FixedLayout,
    Div,
    Button, Panel, View
} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import Icon24Delete from '@vkontakte/icons/dist/24/delete'
import Icon24Add from '@vkontakte/icons/dist/24/add'
import Icon24Write from '@vkontakte/icons/dist/24/write'
import Tasks from "./Tasks";
import Task from './Task'
import EditTask from './EditTask'

class TasksPanel extends Component {
    get task() {
        const id = Number(this.props.route.params.id) || this.state.currentTaskId
        return this.props.state.tasks.filter((task) =>
            task.id === id
        )
    }

    setCurrentTaskId = (currentTaskId) => this.setState({currentTaskId: currentTaskId})
    deleteTask = (id) => this.props.deleteTask(id)
    editTask = (newTask) => this.props.editTask(newTask)

    constructor(props) {
        super(props);

        this.state = {
            currentTaskId: null
        };
    }

    render() {
        let {
            route,
            state,
            tasks,
            router,
        } = this.props

        const osname = platform()

        const activePanel = route.name

        return (
            <View activePanel={activePanel}>
                <Panel id='tasks'>
                    <FixedLayout vertical='top'>
                    </FixedLayout>
                    <Tasks
                        router={router}
                        tasks={tasks}
                        removable={state.removable}
                        onRemovableTasks={this.props.onRemovableTasks}
                        setCurrentTaskId={this.setCurrentTaskId}
                        deleteTask={this.deleteTask}
                    />
                    <FixedLayout vertical='bottom'>
                        {
                            osname === ANDROID ?
                                <Div style={{float: 'right'}}>
                                    <Button
                                        className='FixedBottomButton'
                                        onClick={() => router.navigate('add')}
                                    >
                                        <Icon24Add/>
                                    </Button>
                                </Div>
                                :
                                <Div>
                                    <Button
                                        size="xl"
                                        onClick={() => router.navigate('add')}
                                    >
                                        Новая задача
                                    </Button>
                                </Div>
                        }
                        {
                            osname === ANDROID ?
                                <Div>
                                    <Button
                                        className='FixedBottomButton'
                                        onClick={() => this.props.onRemovableTasks()}
                                    >
                                        <Icon24Delete/>
                                    </Button>
                                </Div>
                                :
                                false
                        }
                    </FixedLayout>
                </Panel>
                <Panel id='task'>
                    <Task
                        router={router}
                        task={this.task[0]}
                    />
                    <FixedLayout vertical='bottom'>
                        {
                            osname === ANDROID ?
                                <Div style={{float: 'right'}}>
                                    <Button
                                        className='FixedBottomButton'
                                        onClick={() => router.navigate('edit', {id: this.task[0].id})}
                                    >
                                        <Icon24Write/>
                                    </Button>
                                </Div>
                                :
                                <Div>
                                    <Button
                                        size="xl"
                                        onClick={() => router.navigate('edit', {id: this.task[0].id})}
                                    >
                                        Редактировать
                                    </Button>
                                </Div>
                        }
                    </FixedLayout>
                </Panel>

                <Panel id='edit' theme="white">
                    <EditTask
                        router={router}
                        task={this.task[0]}
                        editTask={this.editTask}
                    />
                </Panel>
            </View>
        );
    }
}

export default TasksPanel;