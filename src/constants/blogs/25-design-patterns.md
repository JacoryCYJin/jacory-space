---
title: "JavaScript设计模式详解：23种经典模式实践"
excerpt: "深入理解JavaScript中的设计模式，掌握面向对象编程的核心思想和最佳实践"
date: "2024-01-19"
category: "编程设计"
tags: ["设计模式", "JavaScript", "面向对象", "架构设计"]
author: "Jacory"
---

# JavaScript设计模式详解：23种经典模式实践

设计模式是软件开发中解决常见问题的可重用解决方案。它们提供了经过验证的开发范式，能够提高代码的可维护性、可扩展性和可重用性。本文将深入探讨JavaScript中的23种经典设计模式。

## 什么是设计模式？

设计模式是软件设计中常见问题的典型解决方案。它们不是可以直接转换为代码的完整设计，而是描述如何在不同情况下解决问题的模板。

## 创建型模式 (Creational Patterns)

### 1. 单例模式 (Singleton Pattern)

确保一个类只有一个实例，并提供全局访问点。

```javascript
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    Singleton.instance = this;
    this.data = [];
  }

  addItem(item) {
    this.data.push(item);
  }

  getItems() {
    return [...this.data];
  }
}

// 使用示例
const instance1 = new Singleton();
const instance2 = new Singleton();

console.log(instance1 === instance2); // true

instance1.addItem('item1');
console.log(instance2.getItems()); // ['item1']
```

### 2. 工厂模式 (Factory Pattern)

定义一个创建对象的接口，让子类决定实例化哪个类。

```javascript
// 抽象工厂
class AnimalFactory {
  createAnimal(type) {
    switch (type) {
      case 'dog':
        return new Dog();
      case 'cat':
        return new Cat();
      case 'bird':
        return new Bird();
      default:
        throw new Error('Unknown animal type');
    }
  }
}

// 具体产品类
class Dog {
  speak() {
    return 'Woof!';
  }
}

class Cat {
  speak() {
    return 'Meow!';
  }
}

class Bird {
  speak() {
    return 'Tweet!';
  }
}

// 使用示例
const factory = new AnimalFactory();
const dog = factory.createAnimal('dog');
const cat = factory.createAnimal('cat');

console.log(dog.speak()); // 'Woof!'
console.log(cat.speak()); // 'Meow!'
```

### 3. 建造者模式 (Builder Pattern)

将一个复杂对象的构建过程分离出来，使得同样的构建过程可以创建不同的表示。

```javascript
class PizzaBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.pizza = {
      size: 'medium',
      crust: 'thin',
      toppings: [],
      sauce: 'tomato'
    };
    return this;
  }

  setSize(size) {
    this.pizza.size = size;
    return this;
  }

  setCrust(crust) {
    this.pizza.crust = crust;
    return this;
  }

  addTopping(topping) {
    this.pizza.toppings.push(topping);
    return this;
  }

  setSauce(sauce) {
    this.pizza.sauce = sauce;
    return this;
  }

  build() {
    const result = { ...this.pizza };
    this.reset();
    return result;
  }
}

// 使用示例
const pizzaBuilder = new PizzaBuilder();
const pizza = pizzaBuilder
  .setSize('large')
  .setCrust('thick')
  .addTopping('pepperoni')
  .addTopping('mushrooms')
  .setSauce('bbq')
  .build();

console.log(pizza);
// {
//   size: 'large',
//   crust: 'thick',
//   toppings: ['pepperoni', 'mushrooms'],
//   sauce: 'bbq'
// }
```

## 结构型模式 (Structural Patterns)

### 4. 适配器模式 (Adapter Pattern)

将一个类的接口转换成客户期望的另一个接口。

```javascript
// 旧接口
class OldPaymentSystem {
  makePayment(amount) {
    console.log(`Processing payment of $${amount} using old system`);
    return { success: true, amount };
  }
}

// 新接口
class NewPaymentSystem {
  processPayment(amount, currency = 'USD') {
    console.log(`Processing payment of ${amount} ${currency} using new system`);
    return { status: 'completed', amount, currency };
  }
}

// 适配器
class PaymentAdapter {
  constructor(newSystem) {
    this.newSystem = newSystem;
  }

  makePayment(amount) {
    const result = this.newSystem.processPayment(amount);
    return {
      success: result.status === 'completed',
      amount: result.amount
    };
  }
}

// 使用示例
const oldSystem = new OldPaymentSystem();
const newSystem = new NewPaymentSystem();
const adapter = new PaymentAdapter(newSystem);

console.log(oldSystem.makePayment(100));
console.log(adapter.makePayment(100));
```

### 5. 装饰器模式 (Decorator Pattern)

动态地给对象添加新的功能，而不改变其结构。

```javascript
// 基础组件
class Coffee {
  cost() {
    return 10;
  }

  description() {
    return 'Simple coffee';
  }
}

// 装饰器基类
class CoffeeDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }

  cost() {
    return this.coffee.cost();
  }

  description() {
    return this.coffee.description();
  }
}

// 具体装饰器
class Milk extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 2;
  }

  description() {
    return this.coffee.description() + ', milk';
  }
}

class Sugar extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 1;
  }

  description() {
    return this.coffee.description() + ', sugar';
  }
}

class Whip extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 3;
  }

  description() {
    return this.coffee.description() + ', whip';
  }
}

// 使用示例
let coffee = new Coffee();
console.log(`${coffee.description()}: $${coffee.cost()}`);

coffee = new Milk(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);

coffee = new Sugar(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);

coffee = new Whip(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);
```

### 6. 代理模式 (Proxy Pattern)

为其他对象提供一种代理以控制对这个对象的访问。

```javascript
// 真实对象
class RealImage {
  constructor(filename) {
    this.filename = filename;
    this.loadFromDisk();
  }

  loadFromDisk() {
    console.log(`Loading ${this.filename} from disk`);
  }

  display() {
    console.log(`Displaying ${this.filename}`);
  }
}

// 代理对象
class ProxyImage {
  constructor(filename) {
    this.filename = filename;
    this.realImage = null;
  }

  display() {
    if (this.realImage === null) {
      this.realImage = new RealImage(this.filename);
    }
    this.realImage.display();
  }
}

// 使用示例
const image = new ProxyImage('photo.jpg');
// 此时还没有加载图片

image.display(); // 第一次调用会加载并显示
image.display(); // 第二次调用直接显示，不会重新加载
```

## 行为型模式 (Behavioral Patterns)

### 7. 观察者模式 (Observer Pattern)

定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知。

```javascript
class Subject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

class Observer {
  constructor(name) {
    this.name = name;
  }

  update(data) {
    console.log(`${this.name} received: ${data}`);
  }
}

// 使用示例
const subject = new Subject();
const observer1 = new Observer('Observer 1');
const observer2 = new Observer('Observer 2');

subject.addObserver(observer1);
subject.addObserver(observer2);

subject.notify('Hello World!');
// Observer 1 received: Hello World!
// Observer 2 received: Hello World!
```

### 8. 策略模式 (Strategy Pattern)

定义一系列算法，把它们封装起来，并且使它们可以互相替换。

```javascript
// 策略接口
class PaymentStrategy {
  pay(amount) {
    throw new Error('pay method must be implemented');
  }
}

// 具体策略
class CreditCardPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`Paid $${amount} using Credit Card`);
  }
}

class PayPalPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`Paid $${amount} using PayPal`);
  }
}

class BitcoinPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`Paid $${amount} using Bitcoin`);
  }
}

// 上下文
class ShoppingCart {
  constructor() {
    this.paymentStrategy = null;
  }

  setPaymentStrategy(strategy) {
    this.paymentStrategy = strategy;
  }

  checkout(amount) {
    if (this.paymentStrategy) {
      this.paymentStrategy.pay(amount);
    } else {
      console.log('Please select a payment method');
    }
  }
}

// 使用示例
const cart = new ShoppingCart();
const creditCard = new CreditCardPayment();
const paypal = new PayPalPayment();

cart.setPaymentStrategy(creditCard);
cart.checkout(100); // Paid $100 using Credit Card

cart.setPaymentStrategy(paypal);
cart.checkout(50); // Paid $50 using PayPal
```

### 9. 命令模式 (Command Pattern)

将请求封装成对象，从而可以用不同的请求对客户进行参数化。

```javascript
// 命令接口
class Command {
  execute() {
    throw new Error('execute method must be implemented');
  }

  undo() {
    throw new Error('undo method must be implemented');
  }
}

// 接收者
class Light {
  turnOn() {
    console.log('Light is ON');
  }

  turnOff() {
    console.log('Light is OFF');
  }
}

// 具体命令
class LightOnCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }

  execute() {
    this.light.turnOn();
  }

  undo() {
    this.light.turnOff();
  }
}

class LightOffCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }

  execute() {
    this.light.turnOff();
  }

  undo() {
    this.light.turnOn();
  }
}

// 调用者
class RemoteControl {
  constructor() {
    this.commands = [];
    this.history = [];
  }

  setCommand(command) {
    this.commands.push(command);
  }

  pressButton(index) {
    if (index < this.commands.length) {
      const command = this.commands[index];
      command.execute();
      this.history.push(command);
    }
  }

  undo() {
    if (this.history.length > 0) {
      const command = this.history.pop();
      command.undo();
    }
  }
}

// 使用示例
const light = new Light();
const lightOn = new LightOnCommand(light);
const lightOff = new LightOffCommand(light);

const remote = new RemoteControl();
remote.setCommand(lightOn);
remote.setCommand(lightOff);

remote.pressButton(0); // Light is ON
remote.pressButton(1); // Light is OFF
remote.undo(); // Light is ON
```

## 实际应用场景

### 前端组件库设计
```javascript
// 使用组合模式构建UI组件
class Component {
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  add(child) {
    this.children.push(child);
  }

  remove(child) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }

  render() {
    console.log(`Rendering ${this.name}`);
    this.children.forEach(child => child.render());
  }
}

// 使用示例
const root = new Component('App');
const header = new Component('Header');
const main = new Component('Main');
const sidebar = new Component('Sidebar');
const content = new Component('Content');

root.add(header);
root.add(main);
main.add(sidebar);
main.add(content);

root.render();
```

### 状态管理
```javascript
// 使用状态模式管理应用状态
class State {
  handle(context) {
    throw new Error('handle method must be implemented');
  }
}

class LoadingState extends State {
  handle(context) {
    console.log('Loading...');
    context.setState(new SuccessState());
  }
}

class SuccessState extends State {
  handle(context) {
    console.log('Success!');
    context.setState(new ErrorState());
  }
}

class ErrorState extends State {
  handle(context) {
    console.log('Error occurred');
    context.setState(new LoadingState());
  }
}

class Context {
  constructor() {
    this.state = new LoadingState();
  }

  setState(state) {
    this.state = state;
  }

  request() {
    this.state.handle(this);
  }
}

// 使用示例
const context = new Context();
context.request(); // Loading...
context.request(); // Success!
context.request(); // Error occurred
```

## 设计模式选择指南

### 何时使用创建型模式
- **单例模式**: 需要确保全局只有一个实例时
- **工厂模式**: 需要根据条件创建不同类型的对象时
- **建造者模式**: 需要构建复杂对象时

### 何时使用结构型模式
- **适配器模式**: 需要将不兼容的接口转换为兼容接口时
- **装饰器模式**: 需要动态添加功能而不改变对象结构时
- **代理模式**: 需要控制对象访问时

### 何时使用行为型模式
- **观察者模式**: 需要实现事件通知机制时
- **策略模式**: 需要根据不同情况使用不同算法时
- **命令模式**: 需要支持撤销操作时

## 总结

设计模式是软件开发中的重要概念，它们提供了解决常见问题的标准化方法。通过理解和应用这些模式，你可以写出更加优雅、可维护和可扩展的代码。

记住，设计模式不是银弹，过度使用反而会让代码变得复杂。选择合适的设计模式应该基于具体的需求和场景。

---

*"设计模式是经验的结晶，是智慧的传承。"* - GoF
