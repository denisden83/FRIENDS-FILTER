import 'normalize.css';
import '../styles/main.scss';
import friendsList from '../templates/parts/friends-list.hbs';
content.innerHTML = friendsList({ name: 'FRIEND' });