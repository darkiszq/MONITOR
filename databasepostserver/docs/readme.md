## VALID REQUESTS


### POST /
**PAYLOAD – NULL**
**ALWAYS**	- returns JSON with a message „POST request IS called”


### POST //datainstert 

**PAYLOAD – JSON**  
```
	{
		isup : number,
		domain : string
	}
```
    Inserts json contents into database, 
**ON SUCCESS** - returns query results	
**ON ERROR** - returns code 400 and database response


### POST /graphfromdomain

**PAYLOAD – JSON**
```
	{
		domain : string
	}
```
    Send database query for information about percentage of records when the domain was online
**ON SUCCESS** - returns query results	
**ON ERROR** - returns code 400 and database response


### POST /raportfromdomain

**PAYLOAD – JSON**
```
    {
		domain : string
	}
```
    Send database query for raport with records from given domain
**ON SUCCESS** - returns raport
**ON ERROR** - returns code 400 and database response




## FUNCTIONS

### async idGet(res, domain)

    Sends database query for domain id
**ON SUCCESS** - returns domain id
**ON ERROR** - returns code 400 and database response
