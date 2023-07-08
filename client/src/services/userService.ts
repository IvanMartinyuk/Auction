export class UserService {
    baseUrl = 'http://localhost:8080/api/user';
    async signUp(user: any) {
        let response = await fetch(this.baseUrl + '/signup', 
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(user)
                                })
        return response.ok;
    }
    async signIn(user: any) {
        let response = await fetch(this.baseUrl + '/signin', 
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(user)
                                })
        if(response.ok) {
            let data = await response.json();
            sessionStorage.setItem('userId', data.id);
            sessionStorage.setItem('userName', data.name);
        }
        return response.ok;
    }
}