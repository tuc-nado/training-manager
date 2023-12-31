import { useLocation } from 'react-router-dom';

import Section from '../components/Section';
import UserForm from '../components/user/UserForm';

/** Страница регистрации/изменения пользователя */
const UserFormPage = () => {
    const location = useLocation();
    
    return (
        <Section title={ location.pathname === '/profile/edit' ? 'Редактирование' : 'Регистрация' } >
            <UserForm />
        </Section>
    );
}

export default UserFormPage;