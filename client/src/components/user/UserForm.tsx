import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import * as S from '../../styles/components';
import { Direction, Justify, Wrap } from '../../ts/enums/flex';
import RadioButton from '../ui-items/RadioButton';
import useTextField from '../../hooks/forms/useTextField';
import useDateTimeField from '../../hooks/forms/useTimePickerField';
import useLoginField from '../../hooks/forms/useLoginField';
import usePasswordField from '../../hooks/forms/usePasswordField';
import useRadioField from '../../hooks/forms/useRadioButton';
import useForm from '../../hooks/forms/useForm';
import { createUser, getProfile, updateUser } from '../../api/users/users-api';
import { IUser } from '../../ts/interfaces/globals/user';


/** Форма регистрации/изменения пользователя */
const UserForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [errorForm, setErrorForm] = useState(''); // ошибки формы
    const [user, setUser] = useState<IUser>(); // пользователь для редактирования
    const [isVisiblePass, setIsVisiblePass] = useState(true); // состояние видимости поля пароля

    useEffect(() => {
        if (location.pathname === '/profile/edit') { // если форма открыта для редактирования, то получить информацию о пользователе
            getProfile().then(res => {
                setUser(res.data);
                setIsVisiblePass(false);
            }).catch(err => console.log(err));
        }
    }, [location]);

    /** Объект поля логина */
    const login = useLoginField(
        'login', 
        { isRequired: true },
        // если есть записи для изменения, то взять значения для поля из нее, иначе дать дефолтное
        useMemo(() => user?.login || '', [user])
    );

    /** Объект поля пароля */
    const password = usePasswordField('password', {
        minLength: 8,
        isRequired: isVisiblePass,
    });

    /** Объект поля повторного пароля */
    const secondPassword = usePasswordField('password', {
        isRequired: isVisiblePass,
        firstPassword: useMemo(() => password.value, [password.value])
    });

    /** Объект поля фамилии */
    const firstName = useTextField(
        'first-name', 
        { isRequired: true },
        // если есть записи для изменения, то взять значения для поля из нее, иначе дать дефолтное
        useMemo(() => user?.firstName || '', [user])
    );
    
    /** Объект поля имени */
    const lastName = useTextField(
        'last-name', 
        { isRequired: true },    
        // если есть записи для изменения, то взять значения для поля из нее, иначе дать дефолтное
        useMemo(() => user?.lastName || '', [user])
    );

    const gender = useRadioField(
        'gender', 
        { isRequired: true },    
        // если есть записи для изменения, то взять значения для поля из нее, иначе дать дефолтное
        useMemo(() => user?.gender || '', [user])
    );
    
    /** Объект поля даты рождения */
    const birthday = useDateTimeField(
        'birthday', 
        { isRequired: true },
        // если есть записи для изменения, то взять значения для поля из нее, иначе дать дефолтное
        useMemo(() => user ? dayjs(user?.birthday) : null, [user])
    );

    /** Объект формы */
    const form = useForm([login, password, secondPassword, firstName, lastName, gender, birthday]);

    /** Функция-обработчки клика по кнопки "Зарегистрироваться" для сохранения данных в БД */
    const handleSave = async () => {
        if (!form.isValid()) return;
        const data = {
            login: login.value,
            password: isVisiblePass ? password.value : undefined,
            firstName: firstName.value,
            lastName: lastName.value,
            gender: gender.value,
            birthday: birthday.value?.format().slice(0, 10),
        }

        
        try {
            // если объект с пользователем есть (значит форма для редактирования), то запрос на изменение, иначе на добавление
            if (user) {
                await updateUser(data)
                navigate('/profile');
            } else {
                await createUser(data);
                navigate('/');
            }
        } catch (err: any) {
            if (err.response.status === 409) {
                setErrorForm('Данный логин уже занят, попробуйте другой');
            } else {
                setErrorForm('Что-то пошло не так, попробуйте позже');
            }
        }
    }


    return (
        <S.Form>
            <S.Field>
                <S.Label>Фамилия</S.Label>
                <S.Input name={lastName.id} value={lastName.value} onChange={lastName.handleChange}/>
                { lastName.error && <S.Error>{ lastName.error }</S.Error> }
            </S.Field>

            <S.Field>
                <S.Label>Имя</S.Label>
                <S.Input name={firstName.id} value={firstName.value} onChange={firstName.handleChange}/>
                { firstName.error && <S.Error>{ firstName.error }</S.Error> }
            </S.Field>

            <S.Field>
                <S.Label>Логин</S.Label>
                <S.Input name={login.id} value={login.value} onChange={login.handleChange}/>
                { login.error && <S.Error>{ login.error }</S.Error> }
            </S.Field>

            { user && 
                <S.Button onClick={() => setIsVisiblePass(prev => !prev)} type='button'>
                    {isVisiblePass ? 'Отмена' : 'Сменить пароль'}
                </S.Button>
            }


            { isVisiblePass &&
                <>
                    <S.Field>
                        <S.Label>Пароль</S.Label>
                        <S.Input name={password.id} value={password.value} onChange={password.handleChange} type='password' autoComplete="on" />
                        { password.error && <S.Error>{ password.error }</S.Error> }
                    </S.Field>

                    <S.Field>
                        <S.Label>Повторный пароль</S.Label>
                        <S.Input name={secondPassword.id} value={secondPassword.value} onChange={secondPassword.handleChange} type='password' autoComplete="on" />
                        { secondPassword.error && <S.Error>{ secondPassword.error }</S.Error> }
                    </S.Field>
                </>
            }

            <S.Field>
                <S.Label>Пол</S.Label>
                <S.FlexContainer $justify={Justify.SpaceAround} $gap='10px' $wrap={Wrap.Wrap}>
                    <RadioButton name={gender.id} isChecked={gender.value === 'male'} onChange={gender.handleChange} title='Мужской' value='male'/>
                    <RadioButton name={gender.id} isChecked={gender.value === 'female'} onChange={gender.handleChange} title='Женский' value='female'/>
                </S.FlexContainer>
                { gender.error && <S.Error>{ gender.error }</S.Error> }
            </S.Field>

            <S.Field>
                <S.Label>Дата рождения</S.Label>
                <S.StyledDataPicker format='DD/MM/YYYY' value={birthday.value} onChange={birthday.handleChange} disableFuture/> 
                { birthday.error && <S.Error>{ birthday.error }</S.Error> }
            </S.Field>

            { errorForm && <S.Error>{ errorForm }</S.Error> }
            <S.FlexContainer $justify={Justify.SpaceBetween} $direction={Direction.RowReverse}>
                <S.Button onClick={handleSave} type='button' $padding='10px 15px'>
                    { user ? 'Сохранить' : 'Зарегистрироваться' }
                </S.Button>
                { !user && 
                    <S.StyledLink to='/login'>
                        Авторизация
                    </S.StyledLink>
                }
            </S.FlexContainer>
        </S.Form>
    );
}

export default UserForm;