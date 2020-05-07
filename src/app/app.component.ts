import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent 
{
  code:string='';
  operations={add:'+',mul:'*',div:'/',sub:'-'} ; // All Possible operations supported by our compiler
  output:any[]=[];
  parseTree:any[]=[];
  transpiledCode:string='';
  title = 'DashingCompiler';
  errorMessage: string='';
  successMessage: string='';
  executeableJavascript: string='';

  lexicalAnalysis()
  {
    
    //At the first step we are splitting string into token and assigning them properties i.e type, location etc.
    this.output=this.code.split(' ').map(eachToken=>eachToken.trim()).filter(eachTrimmedToken=>eachTrimmedToken.length>0);
    //Here , we first split our input string by spaces and trimmed whitespace from each splitted item. 
    //Then we filtered only those tokens whose length is greater than 0 i.e. no whitespace is allowed
  }

  parser(lexData:any[])
  {
    //Syntax analysis and construction of AST (Abstract Syntax Tree)
    //We will loop throught each token and check for operations and operands
    console.log('In Parser',lexData);
    this.errorMessage='';
    if(lexData.length==0)
    {
      if(this.parseTree.length>0)
      {
        this.successMessage='Parsing Successful';
      }
      return;
    }
    let token=lexData[0];
    if(isNaN(token) && this.operations[String(token)]==undefined)
      {
        //Invalid operation
        this.errorMessage="Invalid Operation";
        return;
      }
      else if(isNaN(token) && this.operations[String(token)]!=undefined)
      {
        //Valid operation
        
        let operation= {type:'operation',value:String(token),expression:[]};
        lexData.shift();
        while(!isNaN(lexData[0]))
        {
          operation['expression'].push(this.parser(lexData));
          if(operation['expression'].length>2)
          {
            this.errorMessage='Invalid Syntax. Only 2 values after operation are allowed';
            return;
          }
          lexData.shift();
        }
       
        this.parseTree.push(operation);
        this.parser(lexData);
      }
      else
      {
        //token is a number i.e. operand
        let operation={type:'number',value:Number(token),expression:[]};
        return operation;

      }

    console.log('Tokens=',lexData,'Parse Tree=',this.parseTree);
  }

  transpileData(parsedData:any[])
  {
    console.log(parsedData);
    if(parsedData.length==0)
    {
      console.log('Transpiled Data',this.transpiledCode);
      if(this.transpileData.length>0)
      {
        this.successMessage='Generated Code='+this.transpiledCode;
      }
      return;
    }
    const node=parsedData[0];
    console.log('Node',node);
    if(node.type=='operation')
    {
      if(node.expression.length!=2)
      {
        this.errorMessage+='Syntax error. Invalid number of arguments!';
        return;
      }
      this.transpiledCode+=`${this.transpileData(node.expression)+this.operations[node.value]+this.transpileData(node.expression)+' '}`;
      parsedData.shift();
      this.transpileData(parsedData);
    }
    else if(node.type=='number')
    {
      parsedData.shift();
      return String(node.value);
    }
    else
    {
      this.errorMessage+='Syntax error. Found number. Operation expected!'
      return;
    }
  }

  execute(transpiledCode)
  {
    if(transpiledCode.length==0)
    {
      this.errorMessage='Invalid transpiled code!'
      return;
    }
    else
    {
     
      //this.executeableJavascript+="document.getElementById('result').innerText="+transpiledCode+";";
      this.executeableJavascript=transpiledCode;
      console.log(this.executeableJavascript,eval(this.executeableJavascript));
      this.successMessage='Result='+eval(this.executeableJavascript);
      
    }
  }

  clearData()
  {
    this.code='';
    this.errorMessage='';
    this.output=[];
    this.parseTree=[];
    this.transpiledCode='';
  }

}
