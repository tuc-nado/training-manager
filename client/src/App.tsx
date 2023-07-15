import * as S from './styles/components';

import NavBar from './componenst/NavBar';


function App() {

    return (
        <S.Header>
            <S.Container>
                <S.FlexContainer>
                    <S.FlexContainer justify='flex-start' gap='10px'>
                        <S.Title>Training-manager</S.Title>
                    </S.FlexContainer>

                    <NavBar />
                </S.FlexContainer>
            </S.Container>
        </S.Header>    
    );
}

export default App;
