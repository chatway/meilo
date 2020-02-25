import React from 'react'
import { PanelHeader, Header, Div, Group } from '@vkontakte/vkui'
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack'

function MailingGroup(props) {

    const mailingGroup = props.mailingGroup
    const router = props.router

    return (
        <div>
            <PanelHeader
                left={
                    <PanelHeaderBack
                        onClick={()=>router.navigate('mailing_groups')}
                    />
                }
            >
                Группа
            </PanelHeader>
            {
                typeof mailingGroup !== 'undefined' &&
                <Group>
                    <Header>{mailingGroup.title}</Header>
                    <Div>{mailingGroup.description}</Div>
                </Group>
            }
        </div>
    )
}

export default MailingGroup
