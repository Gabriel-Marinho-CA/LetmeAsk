type User = {
    name: string;
    address: {
        city: string;
        uf: string;
    }
};

function showWelcomeMessage(user: User){
    return `Welcome ${user.name} (${user.address.city}) - ${user.address.uf})`;
}

showWelcomeMessage ({
    name:'diego',
    address: {
        city: 'Rio do Sul',
        uf: 'SC'
    }
})

