import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <><a href="/docs/docs/welcome/welcome-introduction">开发入门册</a></>,
    imageUrl: 'img/ditto1.png',
    description: (
      <>
        专为 CKB 生态建设者打造的开发文档，涵盖 JS、Ruby 等语言的智能合约开发教程，以及 demo 演示，手把手教你入坑 CKB 开发。
      </>
    ),
  },
  {
    title: <><a href="/blog">精选博客集</a></>,
    imageUrl: 'img/ditto2.png',
    description: (
      <>
        如果你要深入地认识 Nervos，理解 Nervos 为什么会走上现在这样的一条路，以及 Nervos 究竟独特在哪里，你应该来这里逛逛。
      </>
    ),
  },
  {
    title: <><a href="/docs/qa/welcome">小紧张百科</a></>,
    imageUrl: 'img/ditto3.png',
    description: (
      <>
        一个关于 Nervos 的问答板块，如果你对 Nervos 目前还不是很了解，欢迎你来这里寻找答案。有任何想问的问题，也欢迎在此提问。
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <br></br>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <br></br>
          <div className={styles.buttons}>
            <Link
              className={classnames(
              'button button--outline button--secondary button--lg',
                styles.GetStartedButton,
              )}
              to={useBaseUrl('docs/docs/welcome/welcome-introduction')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
