export abstract class Repository {
  abstract getSignedUrl(fileName: string): Promise<string>
}
