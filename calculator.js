var isPrevAns=false

var historyArray=[];


setInterval(function(){
	
	$.get("/Calculator/PostServlet",function(data){
		row=JSON.parse(data);
		processResult(row);
	})
	
		
		
},5000);


function cellClick(val){
	console.log('Clicked '+val);
	
	var textArea=document.getElementById("resultArea")
	
	
	if(val==='='){
		//result
	var resultStr=	textArea.value;
		var opr='+';
			var len=resultStr.length;
			i=0;
			for(;i<len;i++){
				var present=resultStr.substr(i,1);
				console.log(present)
				if(present=='+'||present=='-'||present=='*'||present=='/'||present=='%'){
					opr=resultStr.charAt(i);
					break;
				}
			}
			console.log(opr)
			if(i>0){
				var pre=Number(resultStr.substr(0,i));
				var post=Number(resultStr.substr(i+1));
				console.log(pre,'           ',post);
				
				isPrevAns=true;
				if(opr==='+'){
					textArea.value=pre+post;
				}else if(opr==='-'){
					textArea.value=pre-post;
				}else if(opr==='%'){
					if(post==0){
						textArea.value='Infinity';
						return;
					}
					textArea.value=pre-post;
				}else if(opr==='*'){
					textArea.value=pre*post;
				}else if(opr==='/'){
					if(post==0){
						textArea.value='0';
						return;
					}
					textArea.value=pre-post;
				}
				
				sendToServer(resultStr+"="+textArea.value);
				//historyArray.push(resultStr+"="+textArea.value)
				if(historyArray.length==10){
					historyArray.shift();
				}
				refreshHistory()
			}
			
			
			return ;
			
			
	}
	
	if(isPrevAns){
		textArea.value='';
		isPrevAns=false;
	}
	if(val==='AC'){
		//Clear text area
		textArea.value='0';
	}else if(val=='0' && textArea.value==='0'){
		
	}else{
		if(textArea.value==='0'){
			textArea.value='';
		}
		textArea.value=textArea.value+val;
	}
	
	
}
function processResult(row){
	historyArray=[];
	for(i=0;i<row.length;i++){
		historyArray.push(row[i]);
		
		
	}
	refreshHistory();
}
function sendToServer(str){
	$.post("/Calculator/PostServlet",{calculation:str}).done(function(data){
		console.log(data);
		row=JSON.parse(data);
		processResult(row);
	}).fail(function(f){
		alert('fa')
	});
}
function refreshHistory(){
	var historyEle=document.getElementById("history");
	historyEle.innerHTML='';
	for(i=historyArray.length-1;i>=0;i--){
		historyEle.innerHTML=historyEle.innerHTML+'<br><span>'+historyArray[i]+'</span>'
	}
	
}

