<template>
    <div>
        <h1>PicMap</h1>
        <div id="login" v-if="isLoginScreen">
            <h3>Login</h3>
                or
                <button id="prettyButton" type="button" v-on:click="screenType()">create an account.</button><br><br>
            <input type="text" name="username" v-model="input.username" placeholder="Username" />
            <input type="password" name="password" v-model="input.password" placeholder="Password" />
            <button type="button" v-on:click="login()">Login</button>
        </div>
        <div id="login" v-else>
            <h3>Create Account</h3>
                or
                <button id="prettyButton" type="button" v-on:click="screenType()">login.</button><br><br>
            <input type="text" name="username" v-model="input.username" placeholder="Username" />
            <input type="password" name="password" v-model="input.password" placeholder="Password" />
            <button type="button" v-on:click="createAccount()">Create Account</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'HomePage',
        data() {
            return {
                isLoginScreen: true,
                input: {
                    username: "",
                    password: ""
                }
            }
        },
        methods: {
		    //login trigger 
            login() {
			    //check if username and password are empty
                if(this.input.username != "" && this.input.password != "") {
                    if(this.input.username == "Randy" && this.input.password == "hello") {
                        this.$emit("isLoggedIn", true);
                        //this.$router.replace({ name: "secure" });
                    } else {
                        console.log("The username and / or password is incorrect"); //if incorrect username or password
                    }
                } else {
                    console.log("A username and password must be present");//if no username or password input
                }
            },
            screenType() {
                this.isLoginScreen = !this.isLoginScreen;
            },
            createAccount() {
                /* this'll do stuff */
				var request = {
							"username": "",
							"password": "",
							"photos": []
				}
				request.username = this.input.username;
				request.password = this.input.password;
				var url = "https://pic-app-client.herokuapp.com/users"
				var xhr = new XMLHttpRequest();
				xhr.open("POST", url, true);
				xhr.setRequestHeader("Content-Type", "application/json");
				
				xhr.onload = () => {
				    console.log("in onload for update image xmlhttpr");
				    if (xhr.readyState === xhr.DONE) {
						if (xhr.status === 200) {
							alert("user was created");
							this.isLoginScreen = true;
						}
					}
				};
				xhr.send(request);
            }
        }
    }
</script>

<style scoped>
    h3 {
        margin-top:0px!important;
    }

    h1 {
        text-align: center;
        margin: auto;
        margin-top: 5%;
        font-size: 100px;
        color: #FFFFFF;
    }

    #login {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #FFFFFF;
        margin: auto;
        margin-top: 5%;
        padding: 20px;
    }

    #prettyButton {
        /* Make this look like a hyperlink */
        background:none!important;
        color:inherit;
        border:none; 
        padding:0!important;
        font: inherit;
        /*border is optional*/
        border-bottom:1px solid #444; 
        cursor: pointer;
    }
</style>