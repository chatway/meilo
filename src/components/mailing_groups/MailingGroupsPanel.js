import React, {Component} from 'react'
import {ANDROID, Button, Div, platform, FixedLayout, Panel, View, Snackbar, Avatar} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import MailingGroups from "./MailingGroups";
import Icon24Write from '@vkontakte/icons/dist/24/write'
import MailingGroup from "./MailingGroup";
import Icon16Done from '@vkontakte/icons/dist/16/done'
const blueBackground = {
    backgroundColor: 'var(--accent)'
};
class MailingGroupsPanel extends Component {
    get mailingGroup() {
        const id = Number(this.props.route.params.id) || this.state.currentMailingGroupId
        return this.props.state.mailingGroups.filter((task) =>
            task.id === id
        )
    }
    constructor(props) {
        super(props);

        this.state = {
            currentMailingGroupId: null,
            snackbar: null
        };
        this.openBase = this.openBase.bind(this);
    }

    subscribe = (params) => {
        this.props.subscribe(params)
        this.openBase(params)
    }
    openBase (params) {
        let mailingGroup = this.props.mailingGroups.find(mailingGroup => mailingGroup.id === params.mailingGroupId)
        let text = !params.subscribe ? mailingGroup.button_subscribe : mailingGroup.button_unsubscribe
        text = text ? text : (!params.subscribe ? 'Вы успешно подписались!' : 'Вы успещно отписались!')
        if (this.state.snackbar) return;
        this.setState({ snackbar:
                <Snackbar
                    layout="vertical"
                    onClose={() => this.setState({ snackbar: null })}
                    before={<Avatar size={24} style={blueBackground}><Icon16Done fill="#fff" width={14} height={14} /></Avatar>}
                >
                    {text}
                </Snackbar>
        });
    }

    render() {

        let {
            route,
            mailingGroups,
            router
        } = this.props
        const osname = platform()
        const activePanel = route.name

        return (
            <View activePanel={activePanel} >
                <Panel id='mailing_groups'>
                    <FixedLayout vertical='top'>
                    </FixedLayout>
                    <MailingGroups
                        router={router}
                        mailingGroups={mailingGroups}
                        allowMessagesGroupList={this.props.state.allowMessagesGroupList}
                        subscribe={this.subscribe}
                        stateApp={this.props.state}
                    />
                    {this.state.snackbar}
                </Panel>

                <Panel id='mailing_group'>
                    <MailingGroup
                        router={router}
                        mailingGroup={this.mailingGroup[0]}
                    />
                </Panel>
            </View>
        );
    }
}
export default MailingGroupsPanel;