import React from 'react'
import { List, Cell, PanelHeader, platform, ANDROID, Group, Button, Div } from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import Footer from "../layouts/Footer";
class MailingGroups extends React.Component {
    buttonLabel(mailingGroup) {
        if (this.props.allowMessagesGroupList.indexOf(mailingGroup.id) !== -1) {
            return mailingGroup.button_unsubscribe != null ? mailingGroup.button_unsubscribe : 'Отписаться'
        } else {
            return mailingGroup.button_subscribe != null ? mailingGroup.button_subscribe : 'Подписаться'
        }
    }
    get mainMailingGroup() {
        return this.props.mailingGroups.find(mailingGroup => mailingGroup.main === 1)
    }
    buttonColor(mailingGroup) {
        return this.props.allowMessagesGroupList.indexOf(mailingGroup.id) !== -1 ? 'primary' : 'commerce'
    }
    subscribe = (params) => { this.props.subscribe(params) }

    render() {
        let {
            router,
            mailingGroups,
            stateApp
        } = this.props

        const osname = platform()
        return (
            <div>
                <PanelHeader
                >
                    Подарки
                </PanelHeader>
                {/*<Group>
                    <Div
                        style={{backgroundImage: this.mainMailingGroup && this.mainMailingGroup.hasOwnProperty('id') ? 'url(' + this.mainMailingGroup.image + ')' : '',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            paddingBottom: '6px',
                            borderRadius: 12,
                            minHeight: '250px'
                        }}
                    >
                        <img src={this.mainMailingGroup && this.mainMailingGroup.hasOwnProperty('id') ? this.mainMailingGroup.image : ''} style={{width:'100vw'}}/>
                    </Div>
                </Group>*/}
                <List style={{ paddingTop : (osname === ANDROID) ? 56 : 48 }}>
                    {
                        mailingGroups.map((mailingGroup, index) => (
                            <Group title={mailingGroup.title} key={mailingGroup.id}>

                                <Cell
                                    onClick={()=>router.navigate('mailing_group', { id : mailingGroup.id })}
                                >{mailingGroup.description}</Cell>
                                    {osname === ANDROID ?
                                    <Div style={{ float : 'right' }}>
                                        <Button
                                            className='FixedBottomButton'
                                            onClick={()=>this.subscribe({mailingGroupId: mailingGroup.id,
                                                subscribe: this.props.allowMessagesGroupList.indexOf(mailingGroup.id) === -1 } )}
                                            mode="commerce"
                                        >
                                            {this.buttonLabel(mailingGroup)}
                                        </Button>
                                    </Div>
                                    :
                                    <Div>
                                        <Button
                                            size="l"
                                            onClick={()=>this.subscribe({mailingGroupId: mailingGroup.id,
                                                subscribe: this.props.allowMessagesGroupList.indexOf(mailingGroup.id) === -1 } )}
                                            level={this.buttonColor(mailingGroup)}
                                        >
                                            {this.buttonLabel(mailingGroup)}
                                        </Button>
                                    </Div>}
                            </Group>
                        ))
                    }
                    <Footer
                        router={router}
                        state={stateApp}
                    />
                </List>
            </div>
        );
    }
}

export default MailingGroups;