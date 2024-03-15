class CrptApi {
  constructor(timeUnit, requestLimit) {
      this.lock = new ReentrantLock();
      this.requestLimit = timeUnit.toNanos(1) / requestLimit;
      this.lastRequestTime = 0;
  }

  createDocument(document, signature) {
      this.lock.lock();
      try {
          const currentTime = process.hrtime.bigint();
          const elapsedTime = currentTime - this.lastRequestTime;

          if (elapsedTime < this.requestLimit) {
              const sleepTime = this.requestLimit - elapsedTime;
              Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, Number(sleepTime));
          }

          // Sending a request to the API to create the document

          this.lastRequestTime = process.hrtime.bigint();
      } finally {
          this.lock.unlock();
      }
  }
}