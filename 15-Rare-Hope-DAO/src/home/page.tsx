export default function Home() {
  return (
    <>
      <div className="text-brown-750 flex w-full justify-center text-xl font-bold">
        什么是罕见病？
      </div>
      <br />
      <br />
      <div className="indent-8">
        罕见病（RARE
        DISEASE）是指那些发病率很低的一类疾病，这些疾病往往是慢性的、严重的，甚至危及生命，是人类医学面临的最大挑战之一。目前已知的罕见病超过
        7000 种，约占人类疾病的 10%。
      </div>
      <div className="mt-4 grid grid-cols-[395px,auto]">
        <img
          src="/images/population.png"
          width={355}
          height={229}
          alt="Population"
          className="mx-auto mt-4 rounded"
        />
        <div>
          <div className="indent-8">
            全球已知的7000多种罕见病，累计患者约4.75亿人，其中儿童占病例总数的三分之二。由于每种罕见病的患者群体规模小，制药企业投入的研究资金有限，至今仍有数千种罕见病缺乏获批的特效治疗药物，95%的罕见病患者仍处于无有效治疗手段的困境。
          </div>
          <br />
          <div className="indent-8">
            照顾罕见病患儿需要投入大量时间和财力。部分学校不愿接收罕见病儿童。一个家庭为了照顾一个罕见病患者，需要付出难以想象的精力和金钱。遗憾的是，当今社会对罕见病的了解还远远不够，对于罕见病患者及其家庭也没有很好保障。
          </div>
        </div>
      </div>
    </>
  );
}
