CREATE NONCLUSTERED INDEX [IX_MergeHistory] ON [dbo].[MergeHistory] ([ToId]) ON [PRIMARY]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
