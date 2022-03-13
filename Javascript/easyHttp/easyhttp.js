//ES5 object oriented using proto type.
function easyHTTP(){
    this.http = new XMLHttpRequest();
}

//Make an Http GET Request
easyHTTP.prototype.get = function(url, callback){
    // 1) Open 
    this.http.open('GET',url,true);

    let self = this;
    // 2) Onload
    this.http.onload = function(){
        if(self.http.status === 200){
            callback(null, self.http.responseText);
        } else {
            callback('Error : ' + self.http.status);
        }
    }

    // 3) Send
    this.http.send();
}

//Make an Http POST Request
easyHTTP.prototype.post = function(url, data, callback) {
    this.http.open('POST', url, true);
    this.http.setRequestHeader('Content-type','application/json');

    let self = this;
    this.http.onload = function(){
        callback(null, self.http.responseText);
    }
    this.http.send(JSON.stringify(data));
}

//Make an Http PUT Request
easyHTTP.prototype.put = function(url, data, callback) {
    this.http.open('PUT', url, true);
    this.http.setRequestHeader('Content-type','application/json');

    let self = this;
    this.http.onload = function(){
        callback(null, self.http.responseText);
    }
    this.http.send(JSON.stringify(data));
}

//Make an Http DELETE Request
easyHTTP.prototype.delete = function(url, callback){
    // 1) Open 
    this.http.open('DELETE',url,true);
    // 2) Onload
    let self = this;
    this.http.onload = function(){
        if(self.http.status === 200){
            callback(null, 'Post Deleted');
        } else {
            callback('Error : ' + self.http.status);
        }
    }
    // 3) Send
    this.http.send();
}