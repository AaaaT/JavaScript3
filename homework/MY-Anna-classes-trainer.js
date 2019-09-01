// Tested Steps
// console.log(person1.name + ' is ' + person1.age + ', ' + person1.height + ' cm tall'+ ' and has ' + person1.eyecolour + ' eyes')
// console.log(person1.descriptiveSentence()) //John is 25, 180 cm tall and has blue eyes
// console.log(person2.descriptiveSentence()) //Jane is 28, 160 cm tall and has green eyes.
// console.log(people.descriptiveSentence())  
//John is 25, 180 cm tall and has blue eyes 
//Jane is 28, 160 cm tall and has green eyes.

class Person {
  constructor (name, age, height, eyecolour) {
      this.name = name;
      this.age = age;
      this.height = height;
      this.eyecolour = eyecolour;
  }
  
  descriptiveSentence(){
    return this.name + ' is ' + this.age + ' years old'+ ', ' + this.height + ' cm tall'+ ' and has ' + this.eyecolour + ' eyes.'
  }
}


class People {
  constructor(person1, person2) {
      this.person1=person1
      this.person2=person2
  }
  descriptiveSentence(){
    return this.person1.descriptiveSentence() + '\n' + this.person2.descriptiveSentence()
    //return this.name + ' is ' + this.age + ', ' + this.height + ' cm tall'+ ' and has ' + this.eyecolour + ' eyes'
  }
  
}

class MorePeople {
  constructor(peopleList) {
    this.peopleList=peopleList
  }
  descriptiveSentence(){
    let collectAllthePersons = ""
    for ( let person of peopleList){
      
      collectAllthePersons += person.descriptiveSentence() + '\n'
    
    }

    return collectAllthePersons
  }
}

 let person1 = new Person('John', 25, 180, 'blue')
 let person2 = new Person('Jane', 28, 160, 'green')

 let person3 = new Person('Jack', 64, 190, 'brown')
 let person4 = new Person('Anna', 30, 168, 'gray-green')

const people = new People (person1, person2,)

const peopleList = [person1, person2, person3, person4]
const morePeople = new MorePeople (peopleList)





console.log(morePeople.descriptiveSentence()) 

