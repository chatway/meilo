import React, {Component} from 'react';
import { Div, Button } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import './Footer.css'
import Icon24Message from '@vkontakte/icons/dist/24/message';

class Footer extends Component {
    constructor(props) {
        super(props);
    }
    groupId = () => {
        return ((this.props.state.queryParams != null && this.props.state.queryParams.hasOwnProperty('vk_group_id')) ? this.props.state.queryParams.vk_group_id : '')
    }
    render() {
        let groupId = ((this.props.state.queryParams != null && this.props.state.queryParams.hasOwnProperty('vk_group_id')) ? this.props.state.queryParams.vk_group_id : '')
        return (
            <Div className="footer">
                <Button level="3" component="a" target="_blank"
                           href={'https://vk.me/club' + groupId}  before={<Icon24Message/>}/>
                <Button level="3" component="a" target="_blank"
                           href={"https://vk.com/club" + groupId}>Группа</Button>
                {/*<Button level="3" component="a" onClick={this.openAbout.bind(this)}>О
                    программе</Button>*/}
            </Div>
        );
    }

    openAbout() {
        this.props.router.navigate('about');
    }
}

export default Footer;
