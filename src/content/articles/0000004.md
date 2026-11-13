---
title: 从 unordered_map 到 custom_hash，从 TLE 到 AC——如何防止unordered_map被卡
---
# 引入
一道 ~~确实可能很简单的~~ 简单的小题：[哈希表](https://www.luogu.com.cn/problem/P11615)。

> ## 题目描述
> 
> 你需要维护一个映射 $f:[0,2^{64})\to[0,2^{64})$，初始 $\forall x\in [0,2^{64}),f(x)=0$。
> 
> 有 $n$ 次操作，每次操作给出二元组 $(x,y)$，表示查询 $f(x)$ 的值，之后 $f(x)\gets y$。
> 
> ## 输入格式
> 
> 第一行，一个正整数 $n$。
> 
> 接下来 $n$ 行，每行两个整数 $x,y$ 描述一次操作。
> 
> ## 输出格式
> 
> 为了减少输出量，设第 $i$ 次操作的答案为 $ans_i$，你只需要输出 $\sum_{i=1}^ni\times ans_i$ 对 $2^{64}$ 取模的结果。


既然是模板哈希表，那我就成全他，用 `unordered_map` 做这道题！

我们只需要开一个 `unordered_map`，再像正常操作数组那样修改映射就可以了!

```cpp
#include<bits/stdc++.h>
using namespace std;
char buf[1<<23],*p1=buf,*p2=buf;
#define gc() (p1==p2&&(p2=(p1=buf)+fread(buf,1,1<<21,stdin),p1==p2)?EOF:*p1++)
inline unsigned long long rd() {//读入一个 64 位无符号整数
	unsigned long long x=0;
	char ch=gc();
	while(!isdigit(ch))ch=gc();
	while(isdigit(ch)) x=x*10+(ch^48),ch=gc();
	return x;
}
unordered_map<unsigned long long,unsigned long long> mp;
int main(){
	unsigned long long n;
    cin>>n;
	unsigned long long ans=0;
	for(int i=1;i<=n;i++){
		unsigned long long x=rd(),y=rd();
		ans+=(__int128)mp[x]*i%((__int128)2<<64);
		mp[x]=y;
	}
	cout<<ans;
}
```

# TLE80pts!!!!
Umm，怎么回事？

哦，`unordered_map` 底层确实是哈希表，但是他的哈希函数太弱了。

`unordered_map` 的原理是：

提前开了很多的用于存储的链表，称作桶。对于桶内所有元素，记录 key 和 value，即我们填到 mp 里的这个数（称键值），和 mp 所代表的值。

对于数字 x，
+ 通过一些简单的方式，计算 x 对应的哈希函数值。
+ 通过哈希函数值，得到对应的桶的位置。
+ 依次比较桶内元素的 key 值，直到找到我们要找的 key 值。
+ 对 value 进行查询或修改。

我们会发现有一个问题。

正常来说，`unordered_map` 是线性时间复杂度（即 $O(1)$），这是因为基本来说，桶是一个萝卜一个坑，只要找到对应的桶，因为桶内只有一个元素，我们直接就找到对应值了。

可是，邪恶的 `_fairytale_` 居然预测了 `unordered_map` 的哈希函数，并制造了大量哈希函数值相同的数。这使得大量的数都填充到了相同的桶内。对于所有桶内元素，我们都要一个一个找到我们需要的键值，真的是太坏了。

所以，我们一定要让 `_fairytale_` 无法猜到我们的哈希函数，所以，我们要使用相对随机的哈希函数，这样他（`_fairytale_` 没说代词要用什么）就没有办法了。

于是，我们就换一个更加强大的哈希函数！

```cpp
//抄袭可耻
#include<bits/stdc++.h>
using namespace std;
char buf[1<<23],*p1=buf,*p2=buf;
#define gc() (p1==p2&&(p2=(p1=buf)+fread(buf,1,1<<21,stdin),p1==p2)?EOF:*p1++)
inline unsigned long long rd() {//读入一个 64 位无符号整数
	unsigned long long x=0;
	char ch=gc();
	while(!isdigit(ch))ch=gc();
	while(isdigit(ch)) x=x*10+(ch^48),ch=gc();
	return x;
}
struct custom_hash {
    static uint64_t splitmix64(unsigned long long x) {
        x+=0x9e3779b97f4a7c15;
        x=(x^(x>>30))*0xbf58476d1ce4e5b9;
        x=(x^(x>>27))*0x94d049bb133111eb;
        return x^(x>>31);
    }
    size_t operator()(unsigned long long x) const {
        static const unsigned long long FIXED_RANDOM=chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(x+FIXED_RANDOM);
    }
};
unordered_map<unsigned long long,unsigned long long,custom_hash> mp;
int main(){
	int n;
	cin>>n;
	unsigned long long ans=0;
	for(int i=1;i<=n;i++){
		unsigned long long x=rd(),y=rd();
		ans+=(__int128)mp[x]*i%((__int128)2<<64);
		mp[x]=y;
	}
	cout<<ans;
}
```

`splitmix64` 是一个伪随机数生成算法，也是 java 语言的默认随机数生成算法，这样我们就AC了！

哇，真的AC了！
# [记录](https://www.luogu.com.cn/record/233826465)
但是，我知道作为聪明的你，一定不满足于这个：
![](/assets/db9379e07547ab1b5a9cd8b631021fde.png)
额嗯？不是优化了吗？！怎么还是这么长时间？！为什么，为什么，这究竟是为什么？！一定是还有什么别的方法！

是，的！

在 `unordered_map` 中，随着元素的逐渐增多，桶的数量也会增加。我们每加一倍的元素，`unordered_map` 就会重新开一次桶，真的是太慢了。

所以，我们可以提前把桶开好，这样就可以使我们的时间，快一秒！

也就是加上下面的代码：

```cpp
mp.reserve(n);//提前预约 n 个位置。
```
可是，用时 4s 还是太慢了。

别急，还有办法！

我们可以尽可能多的开桶，这样元素就不容易撞在同一个桶里，时间还会变快！

也就是下面的代码：

```cpp
mp.max_load_factor(0.25);//让开的桶的数量是元素个数的4倍！
```

好了，现在我们已经跑到了 3.5s 甚至是 3s 的优秀成绩！这个和运气有关，因为我们的哈希函数是随机的。